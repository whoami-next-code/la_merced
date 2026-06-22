import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async findAll(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabase
      .from('sales')
      .select('*, customer:customers(*), items:sale_items(*, product:products(*))', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data, total: count, page, limit };
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('sales')
      .select('*, customer:customers(*), items:sale_items(*, product:products(*))')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(dto: CreateSaleDto, sellerId?: string) {
    const subtotal = dto.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    const total = subtotal - (dto.discount ?? 0) + (dto.tax ?? 0);

    const { data: sale, error: saleError } = await this.supabase
      .from('sales')
      .insert({
        customer_id: dto.customer_id,
        seller_id: sellerId,
        subtotal,
        discount: dto.discount ?? 0,
        tax: dto.tax ?? 0,
        total,
        payment_method: dto.payment_method,
        notes: dto.notes,
      })
      .select()
      .single();

    if (saleError) throw saleError;

    const items = dto.items.map((item) => ({
      sale_id: sale.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount: item.discount ?? 0,
      subtotal: item.unit_price * item.quantity - (item.discount ?? 0),
    }));

    const { error: itemsError } = await this.supabase.from('sale_items').insert(items);
    if (itemsError) throw itemsError;

    return this.findOne(sale.id);
  }
}
