import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';

@Injectable()
export class InventoryService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async getMovements(productId?: string) {
    let query = this.supabase
      .from('inventory_movements')
      .select('*, product:products(id, sku, name)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (productId) query = query.eq('product_id', productId);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async registerMovement(body: {
    product_id: string;
    movement_type: 'entry' | 'exit' | 'adjustment';
    quantity: number;
    notes?: string;
    created_by?: string;
  }) {
    const { data: product, error: productError } = await this.supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', body.product_id)
      .single();

    if (productError) throw productError;

    const stockBefore = product.stock_quantity;
    let stockAfter = stockBefore;

    if (body.movement_type === 'entry') stockAfter = stockBefore + body.quantity;
    else if (body.movement_type === 'exit') stockAfter = stockBefore - body.quantity;
    else stockAfter = body.quantity;

    if (stockAfter < 0) throw new BadRequestException('Stock insuficiente');

    await this.supabase
      .from('products')
      .update({ stock_quantity: stockAfter })
      .eq('id', body.product_id);

    const { data, error } = await this.supabase
      .from('inventory_movements')
      .insert({
        ...body,
        stock_before: stockBefore,
        stock_after: stockAfter,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
