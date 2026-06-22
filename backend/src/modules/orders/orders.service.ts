import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';

@Injectable()
export class OrdersService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  findAll(status?: string) {
    let query = this.supabase
      .from('orders')
      .select('*, customer:customers(*), items:order_items(*, product:products(*))')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    return query;
  }

  findByNumber(orderNumber: string) {
    return this.supabase
      .from('orders')
      .select('*, customer:customers(*), items:order_items(*, product:products(*)), history:order_status_history(*)')
      .eq('order_number', orderNumber)
      .single();
  }

  async updateStatus(id: string, status: string, notes?: string, changedBy?: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await this.supabase.from('order_status_history').insert({
      order_id: id,
      status,
      notes,
      changed_by: changedBy,
    });

    return data;
  }
}
