'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ShoppingCart, Package, AlertTriangle, ClipboardList, Users, TrendingUp,
} from 'lucide-react';
import { apiFetch } from '@/lib/api/client';
import type { DashboardOverview } from '@/types';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => apiFetch<DashboardOverview>('/dashboard/overview'),
    retry: false,
  });

  const cards = [
    { title: 'Ventas hoy', value: stats ? `S/ ${stats.salesToday.toFixed(2)}` : '—', icon: ShoppingCart },
    { title: 'Ventas del mes', value: stats ? `S/ ${stats.salesMonth.toFixed(2)}` : '—', icon: TrendingUp },
    { title: 'Crecimiento', value: stats ? `${stats.salesGrowthPercent}%` : '—', icon: TrendingUp },
    { title: 'Stock crítico', value: stats?.lowStockCount ?? '—', icon: AlertTriangle },
    { title: 'Pedidos pendientes', value: stats?.pendingOrders ?? '—', icon: ClipboardList },
    { title: 'Nuevos clientes', value: stats?.newCustomers ?? '—', icon: Users },
    { title: 'Productos activos', value: '—', icon: Package },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Panel administrativo — La Merced PyK</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.slice(0, 4).map(({ title, value, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.slice(4).map(({ title, value, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats?.topProducts?.length ? (
        <Card>
          <CardHeader><CardTitle>Productos más vendidos</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.topProducts.map((p, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{p.name} <span className="text-muted-foreground">({p.sku})</span></span>
                  <span className="font-medium">{p.qty} uds.</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {!stats && !isLoading && (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Conecta Supabase y la API con credenciales de staff para ver indicadores en tiempo real.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
