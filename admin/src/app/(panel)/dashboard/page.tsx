'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ShoppingCart,
  Package,
  AlertTriangle,
  ClipboardList,
  Users,
  TrendingUp,
} from 'lucide-react';
import { useApi } from '@/hooks/use-api';
import type { DashboardOverview } from '@/types';
import { PageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ADMIN_ROUTES } from '@/constants/routes';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const { api } = useApi();

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api<DashboardOverview>('/dashboard/overview'),
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });

  const primaryCards = [
    {
      title: 'Ventas hoy',
      value: stats ? `S/ ${stats.salesToday.toFixed(2)}` : '—',
      icon: ShoppingCart,
      accent: 'primary' as const,
      href: ADMIN_ROUTES.SALES,
    },
    {
      title: 'Ventas del mes',
      value: stats ? `S/ ${stats.salesMonth.toFixed(2)}` : '—',
      icon: TrendingUp,
      accent: 'success' as const,
      href: ADMIN_ROUTES.REPORTS,
    },
    {
      title: 'Crecimiento',
      value: stats
        ? `${stats.salesGrowthPercent > 0 ? '+' : ''}${stats.salesGrowthPercent}%`
        : '—',
      icon: TrendingUp,
      accent: 'info' as const,
    },
    {
      title: 'Stock crítico',
      value: stats?.lowStockCount ?? '—',
      icon: AlertTriangle,
      accent: 'warning' as const,
      href: ADMIN_ROUTES.INVENTORY,
    },
  ];

  const secondaryCards = [
    {
      title: 'Pedidos pendientes',
      value: stats?.pendingOrders ?? '—',
      icon: ClipboardList,
      accent: 'chart-2' as const,
      href: ADMIN_ROUTES.ORDERS,
    },
    {
      title: 'Nuevos clientes',
      value: stats?.newCustomers ?? '—',
      icon: Users,
      accent: 'info' as const,
      href: ADMIN_ROUTES.CUSTOMERS,
    },
    {
      title: 'Productos activos',
      value: stats?.activeProducts ?? '—',
      icon: Package,
      accent: 'primary' as const,
      href: ADMIN_ROUTES.PRODUCTS,
    },
  ];

  return (
    <div className="admin-page-enter space-y-8">
      <PageHeader
        title="Dashboard"
        description="Resumen operativo — La Merced PyK"
      />

      <section aria-labelledby="kpi-primary-heading">
        <h2 id="kpi-primary-heading" className="sr-only">
          Indicadores principales
        </h2>
        <div className="admin-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {primaryCards.map((card) => (
            <StatCard key={card.title} {...card} isLoading={isLoading} />
          ))}
        </div>
      </section>

      <section aria-labelledby="kpi-secondary-heading">
        <h2 id="kpi-secondary-heading" className="sr-only">
          Indicadores secundarios
        </h2>
        <div className="admin-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {secondaryCards.map((card) => (
            <StatCard key={card.title} {...card} isLoading={isLoading} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {stats?.topProducts?.length ? (
          <Card className="admin-card border-0">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base font-semibold">Productos más vendidos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border/60">
                {stats.topProducts.map((p, i) => (
                  <li
                    key={`${p.sku}-${i}`}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm transition-colors hover:bg-muted/40"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary"
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{p.sku}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{p.qty} uds.</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <Card className="admin-card border-0 p-5">
            <Skeleton className="mb-4 h-5 w-48" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </Card>
        ) : null}

        {stats?.lowStock?.length ? (
          <Card className="admin-card border-0">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base font-semibold">Alertas de stock bajo</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border/60">
                {stats.lowStock.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.sku}</p>
                    </div>
                    <Badge variant="destructive">
                      {p.stock_quantity} / {p.min_stock}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {!stats && !isLoading && (
        <Card className="admin-card border-0 border-dashed">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {isError
              ? 'No se pudieron cargar los indicadores. Verifica que el backend esté en marcha y vuelve a intentar.'
              : 'Sin datos de ventas todavía. Registra ventas en POS o recibe pedidos web para ver indicadores.'}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
