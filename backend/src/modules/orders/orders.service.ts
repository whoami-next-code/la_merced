import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import {
  calculateOrderTotals,
  calculatePromotionDiscount,
} from '../../shared/utils/order-totals.util';
import { SettingsService } from '../settings/settings.service';
import { PromotionsService } from '../promotions/promotions.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly settingsService: SettingsService,
    private readonly promotionsService: PromotionsService,
  ) {}

  findAll(status?: string) {
    let query = this.supabase
      .from('orders')
      .select('*, customer:customers(*), items:order_items(*, product:products(*))')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    return query;
  }

  findMyOrders(userId: string) {
    return this.supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(id, name, sku, slug))')
      .eq('customer.customers.user_id', userId)
      .order('created_at', { ascending: false });
  }

  async findMyOrdersByUser(userId: string) {
    const { data: customer } = await this.supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!customer) return { data: [] };

    const { data, error } = await this.supabase
      .from('orders')
      .select(
        `*,
        items:order_items(
          *,
          product:products(
            id,
            name,
            sku,
            slug,
            images:product_images(url, storage_path, is_primary)
          )
        )`,
      )
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(
        error.message ?? 'No se pudieron cargar tus pedidos',
      );
    }
    return { data: data ?? [] };
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .select(
        '*, customer:customers(*), items:order_items(*, product:products(*)), history:order_status_history(*)',
      )
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException('Pedido no encontrado');
    return data;
  }

  async findByNumber(orderNumber: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .select(
        `*,
        customer:customers(*),
        items:order_items(
          *,
          product:products(
            *,
            images:product_images(url, storage_path, is_primary)
          )
        ),
        history:order_status_history(*)`,
      )
      .eq('order_number', orderNumber)
      .single();

    if (error || !data) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return data;
  }

  async create(dto: CreateOrderDto, userId: string) {
    const productIds = dto.items.map((i) => i.product_id);
    const { data: products, error: productsError } = await this.supabase
      .from('products')
      .select('id, name, sale_price, stock_quantity, is_active')
      .in('id', productIds);

    if (productsError) throw productsError;
    if (!products?.length || products.length !== dto.items.length) {
      throw new BadRequestException('Uno o más productos no existen');
    }

    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.product_id)!;
      if (!product.is_active) {
        throw new BadRequestException(`Producto inactivo: ${product.name}`);
      }
      if (product.stock_quantity < item.quantity) {
        throw new BadRequestException(`Stock insuficiente: ${product.name}`);
      }
    }

    let customerId: string;
    const { data: existingCustomer } = await this.supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('email, full_name, phone')
        .eq('id', userId)
        .single();

      const { data: newCustomer, error: customerError } = await this.supabase
        .from('customers')
        .insert({
          user_id: userId,
          full_name: profile?.full_name || 'Cliente',
          email: profile?.email,
          phone: profile?.phone,
          address: dto.shipping_address,
          city: dto.shipping_city,
        })
        .select('id')
        .single();

      if (customerError) throw customerError;
      customerId = newCustomer.id;
    }

    const orderItems = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.product_id)!;
      const unitPrice = Number(product.sale_price);
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal: unitPrice * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((acc, i) => acc + i.subtotal, 0);

    let discount = 0;
    const welcome = await this.promotionsService.getWelcomeEligibility(userId);
    if (welcome.eligible && welcome.promotion) {
      discount = calculatePromotionDiscount(subtotal, welcome.promotion);
    }

    const storeSettings = await this.settingsService.getStoreSettings();
    const { shipping_cost: shippingCost, total } = calculateOrderTotals(
      subtotal,
      storeSettings,
      discount,
    );

    const { data: order, error: orderError } = await this.supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        order_number: '',
        status: 'pending',
        subtotal,
        shipping_cost: shippingCost,
        discount,
        total,
        payment_method: dto.payment_method ?? 'transfer',
        shipping_address: dto.shipping_address,
        shipping_city: dto.shipping_city,
        notes: dto.notes,
      })
      .select('id, order_number')
      .single();

    if (orderError) {
      throw new BadRequestException(
        orderError.message ?? 'No se pudo registrar el pedido',
      );
    }

    const itemsWithOrder = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await this.supabase.from('order_items').insert(itemsWithOrder);
    if (itemsError) throw itemsError;

    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.product_id)!;
      const stockBefore = product.stock_quantity;
      const stockAfter = stockBefore - item.quantity;

      await this.supabase
        .from('products')
        .update({ stock_quantity: stockAfter })
        .eq('id', item.product_id);

      await this.supabase.from('inventory_movements').insert({
        product_id: item.product_id,
        movement_type: 'sale',
        quantity: item.quantity,
        stock_before: stockBefore,
        stock_after: stockAfter,
        reference_type: 'order',
        reference_id: order.id,
      });
    }

    await this.supabase.from('order_status_history').insert({
      order_id: order.id,
      status: 'pending',
      notes: 'Pedido creado',
      changed_by: userId,
    });

    await this.supabase.from('cart_items').delete().eq('user_id', userId);

    const { data: fullOrder, error: fetchError } = await this.supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*))')
      .eq('id', order.id)
      .single();

    if (fetchError) throw fetchError;
    return fullOrder;
  }

  async updateStatus(id: string, status: string, notes?: string, changedBy?: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new NotFoundException('Pedido no encontrado');

    await this.supabase.from('order_status_history').insert({
      order_id: id,
      status,
      notes,
      changed_by: changedBy,
    });

    return data;
  }
}
