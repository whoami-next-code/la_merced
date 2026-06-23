'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useApi } from '@/hooks/use-api';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

type OrderItem = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  items?: { quantity: number; product?: { name: string } }[];
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export default function PedidosPage() {
  const { api } = useApi();

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api<{ data: OrderItem[] }>('/orders/my'),
    retry: false,
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Mis pedidos</h1>
        <p className="text-muted-foreground mb-6">Inicia sesión para ver tu historial de compras.</p>
        <Link href={PUBLIC_ROUTES.LOGIN} className={cn(buttonVariants())}>
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const orders = data?.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Mis pedidos</h1>
      <p className="text-muted-foreground mb-8">Historial de compras en línea</p>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando pedidos…</p>
      ) : !orders.length ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground mb-4">Aún no tienes pedidos registrados.</p>
          <Link href={PUBLIC_ROUTES.CATALOG} className={cn(buttonVariants())}>
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <ul className="space-y-4" aria-label="Lista de pedidos">
          {orders.map((order) => (
            <li key={order.id}>
              <Card>
                <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('es-PE', {
                        dateStyle: 'medium',
                      })}
                    </p>
                    {order.items?.length ? (
                      <p className="text-sm mt-1">
                        {order.items.map((i) => i.product?.name).filter(Boolean).join(', ')}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{STATUS_LABELS[order.status] ?? order.status}</Badge>
                    <span className="font-bold tabular-nums">S/ {Number(order.total).toFixed(2)}</span>
                    <Link
                      href={`${PUBLIC_ROUTES.ORDER_TRACK}?numero=${order.order_number}`}
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                    >
                      Seguir
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Link href={PUBLIC_ROUTES.ORDER_TRACK} className={cn(buttonVariants({ variant: 'outline' }))}>
          Rastrear un pedido
        </Link>
      </div>
    </div>
  );
}
