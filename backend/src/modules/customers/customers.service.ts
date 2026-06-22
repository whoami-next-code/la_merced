import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';

@Injectable()
export class CustomersService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  findAll(search?: string) {
    let query = this.supabase.from('customers').select('*').order('full_name');
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }
    return query;
  }

  findOne(id: string) {
    return this.supabase
      .from('customers')
      .select('*, sales:sales(*), orders:orders(*)')
      .eq('id', id)
      .single();
  }

  create(body: Record<string, unknown>) {
    return this.supabase.from('customers').insert(body).select().single();
  }
}
