import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';

@Injectable()
export class SettingsService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async findAll() {
    const { data, error } = await this.supabase
      .from('app_settings')
      .select('*')
      .order('key');

    if (error) throw error;
    return data;
  }

  async findOne(key: string) {
    const { data, error } = await this.supabase
      .from('app_settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error) throw new NotFoundException('Configuración no encontrada');
    return data;
  }

  async upsert(key: string, value: Record<string, unknown>, userId: string, description?: string) {
    const { data, error } = await this.supabase
      .from('app_settings')
      .upsert(
        {
          key,
          value,
          description,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' },
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
