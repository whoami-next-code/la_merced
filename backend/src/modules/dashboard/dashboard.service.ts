import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';

@Injectable()
export class DashboardService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async getOverview() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      salesToday,
      salesMonth,
      salesLastMonth,
      lowStock,
      pendingOrders,
      newCustomers,
      topProducts,
    ] = await Promise.all([
      this.supabase
        .from('sales')
        .select('total')
        .gte('created_at', startOfDay.toISOString())
        .eq('status', 'completed'),
      this.supabase
        .from('sales')
        .select('total')
        .gte('created_at', startOfMonth.toISOString())
        .eq('status', 'completed'),
      this.supabase
        .from('sales')
        .select('total')
        .gte('created_at', startOfLastMonth.toISOString())
        .lte('created_at', endOfLastMonth.toISOString())
        .eq('status', 'completed'),
      this.supabase
        .from('products')
        .select('id, sku, name, stock_quantity, min_stock')
        .filter('stock_quantity', 'lte', 'min_stock')
        .eq('is_active', true)
        .limit(10),
      this.supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed', 'processing']),
      this.supabase
        .from('customers')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString()),
      this.supabase
        .from('sale_items')
        .select('product_id, quantity, product:products(name, sku)')
        .limit(50),
    ]);

    const sum = (rows: { total: number }[] | null) =>
      rows?.reduce((acc, r) => acc + Number(r.total), 0) ?? 0;

    const salesTodayTotal = sum(salesToday.data);
    const salesMonthTotal = sum(salesMonth.data);
    const salesLastMonthTotal = sum(salesLastMonth.data);

    const growth =
      salesLastMonthTotal > 0
        ? ((salesMonthTotal - salesLastMonthTotal) / salesLastMonthTotal) * 100
        : 0;

    const productCounts = new Map<string, { name: string; sku: string; qty: number }>();
    topProducts.data?.forEach((item) => {
      const pid = item.product_id as string;
      const raw = item.product as unknown;
      const product = (Array.isArray(raw) ? raw[0] : raw) as { name: string; sku: string } | null;
      const existing = productCounts.get(pid);
      if (existing) existing.qty += item.quantity;
      else if (product)
        productCounts.set(pid, { name: product.name, sku: product.sku, qty: item.quantity });
    });

    const topSold = [...productCounts.values()]
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return {
      salesToday: salesTodayTotal,
      salesMonth: salesMonthTotal,
      salesGrowthPercent: Math.round(growth * 100) / 100,
      lowStock: lowStock.data ?? [],
      lowStockCount: lowStock.data?.length ?? 0,
      pendingOrders: pendingOrders.count ?? 0,
      newCustomers: newCustomers.count ?? 0,
      topProducts: topSold,
    };
  }
}
