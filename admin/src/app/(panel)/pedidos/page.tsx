'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useApi } from '@/hooks/use-api';
import type { Order } from '@/types';
import { PageHeader } from '@/components/admin/page-header';
import { DataTableShell } from '@/components/admin/data-table-shell';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline',
  confirmed: 'secondary',
  processing: 'default',
  shipped: 'default',
  delivered: 'default',
  cancelled: 'destructive',
};

export default function AdminPedidosPage() {
  const { api } = useApi();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: async () => {
      const q = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const res = await api<{ data: Order[] | null }>(`/orders${q}`);
      return res.data ?? [];
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      toast.success('Estado actualizado');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="admin-page-enter space-y-6">
      <PageHeader title="Pedidos" description="Gestión y seguimiento de pedidos online" />

      <div className="max-w-xs space-y-2">
        <Label htmlFor="order-filter">Filtrar por estado</Label>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
          <SelectTrigger id="order-filter" className="w-full">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTableShell
        title="Listado de pedidos"
        isLoading={isLoading}
        actions={<Badge variant="outline">{orders.length} pedidos</Badge>}
      >
        {orders.length ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead scope="col">Nº pedido</TableHead>
                <TableHead scope="col">Cliente</TableHead>
                <TableHead scope="col">Fecha</TableHead>
                <TableHead scope="col" className="text-right">Total</TableHead>
                <TableHead scope="col">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.order_number}</TableCell>
                  <TableCell>{order.customer?.full_name ?? '—'}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('es-PE')}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    S/ {Number(order.total).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(status) => status && statusMutation.mutate({ id: order.id, status })}
                      disabled={statusMutation.isPending}
                    >
                      <SelectTrigger className="w-[160px]" aria-label={`Estado del pedido ${order.order_number}`}>
                        <SelectValue>
                          <Badge variant={statusVariant[order.status] ?? 'outline'}>
                            {statusLabels[order.status] ?? order.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">Sin pedidos encontrados.</p>
        )}
      </DataTableShell>
    </div>
  );
}
