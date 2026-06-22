import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async findAll(params?: { search?: string; categoryId?: string; brandId?: string; page?: number; limit?: number }) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('products')
      .select('*, category:categories(*), brand:brands(*), images:product_images(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (params?.search) {
      query = query.or(`name.ilike.%${params.search}%,sku.ilike.%${params.search}%`);
    }
    if (params?.categoryId) {
      query = query.eq('category_id', params.categoryId);
    }
    if (params?.brandId) {
      query = query.eq('brand_id', params.brandId);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count, page, limit };
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('products')
      .select('*, category:categories(*), brand:brands(*), images:product_images(*)')
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException('Producto no encontrado');
    return data;
  }

  async create(dto: CreateProductDto) {
    const { data, error } = await this.supabase.from('products').insert(dto).select().single();
    if (error) throw error;
    return data;
  }

  async update(id: string, dto: UpdateProductDto) {
    const { data, error } = await this.supabase
      .from('products')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new NotFoundException('Producto no encontrado');
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return { deleted: true };
  }

  async getLowStock() {
    const { data, error } = await this.supabase
      .from('products')
      .select('id, sku, name, stock_quantity, min_stock')
      .filter('stock_quantity', 'lte', 'min_stock')
      .eq('is_active', true);

    if (error) throw error;
    return data;
  }
}
