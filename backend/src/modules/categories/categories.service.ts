import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';

@Injectable()
export class CategoriesService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async findAll() {
    const { data, error } = await this.supabase.from('categories').select('*').order('sort_order');
    if (error) throw error;
    return data;
  }

  async create(body: { name: string; slug: string; description?: string; parent_id?: string }) {
    const { data, error } = await this.supabase.from('categories').insert(body).select().single();
    if (error) throw error;
    return data;
  }
}
