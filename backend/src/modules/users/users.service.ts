import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';

@Injectable()
export class UsersService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  findAll() {
    return this.supabase.from('profiles').select('*').order('full_name');
  }

  updateRole(id: string, role: string) {
    return this.supabase.from('profiles').update({ role }).eq('id', id).select().single();
  }

  updateStatus(id: string, isActive: boolean) {
    return this.supabase.from('profiles').update({ is_active: isActive }).eq('id', id).select().single();
  }
}
