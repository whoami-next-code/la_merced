'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { CheckCircle2, Printer } from 'lucide-react';
import { ordersService } from '@/services/catalog.service';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const PAYMENT_LABELS: Record<string, string> = {
  transfer: 'Transferencia bancaria',
  yape: 'Yape',
  plin: 'Plin',
  card: 'Tarjeta',
  cash: 'Efectivo contra entrega',
};

export function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('numero') ?? '';

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order-confirmation', orderNumber],
    queryFn: () => ordersService.track(orderNumber),
    enabled: orderNumber.length >= 5,
  });

  if (!orderNumber) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">No se encontró el número de pedido.</p>
        <Link href={PUBLIC_ROUTES.HOME} className={cn(buttonVariants(), 'mt-4 inline-flex')}>
          Ir al inicio
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Cargando comprobante…
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-destructive mb-4">No se pudo cargar el comprobante.</p>
        <Link href={PUBLIC_ROUTES.ORDER_TRACK} className={cn(buttonVariants({ variant: 'outline' }))}>
          Rastrear pedido
        </Link>
      </div>
    );
  }

  const orderData = order as {
    order_number: string;
    created_at: string;
    status: string;
    subtotal: number;
    tax?: number;
    shipping_cost?: number;
    total: number;
    payment_method?: string;
    shipping_address?: string;
    shipping_city?: string;
    items?: { quantity: number; subtotal: number; product?: { name: string } }[];
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 print:py-4">
      <div className="mb-8 text-center print:mb-4">
        <CheckCircle2 className="mx-auto mb-4 size-12 text-green-600" aria-hidden />
        <h1 className="text-3xl font-bold">¡Compra exitosa!</h1>
        <p className="mt-2 text-muted-foreground">
          Tu pedido ha sido registrado correctamente.
        </p>
      </div>

      <Card className="print:shadow-none print:border">
        <CardHeader>
          <CardTitle>Comprobante de compra</CardTitle>
          <p className="text-sm text-muted-foreground font-mono">{orderData.order_number}</p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <span className="text-muted-foreground">Fecha:</span>{' '}
              {new Date(orderData.created_at).toLocaleString('es-PE')}
            </div>
            <div>
              <span className="text-muted-foreground">Estado:</span> Pendiente
            </div>
            <div>
              <span className="text-muted-foreground">Pago:</span>{' '}
              {PAYMENT_LABELS[orderData.payment_method ?? ''] ?? orderData.payment_method}
            </div>
            {orderData.shipping_address ? (
              <div className="sm:col-span-2">
                <span className="text-muted-foreground">Envío:</span>{' '}
                {orderData.shipping_address}, {orderData.shipping_city}
              </div>
            ) : null}
          </div>

          <div>
            <p className="font-medium mb-2">Productos</p>
            <ul className="space-y-1">
              {orderData.items?.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item.product?.name ?? 'Producto'} × {item.quantity}</span>
                  <span className="tabular-nums">S/ {Number(item.subtotal).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-3 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>S/ {Number(orderData.subtotal).toFixed(2)}</span>
            </div>
            {orderData.tax != null ? (
              <div className="flex justify-between">
                <span>IGV</span>
                <span>S/ {Number(orderData.tax).toFixed(2)}</span>
              </div>
            ) : null}
            {orderData.shipping_cost != null ? (
              <div className="flex justify-between">
                <span>Envío</span>
                <span>S/ {Number(orderData.shipping_cost).toFixed(2)}</span>
              </div>
            ) : null}
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>S/ {Number(orderData.total).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center print:hidden">
        <Link href={PUBLIC_ROUTES.ORDERS} className={cn(buttonVariants())}>
          Ver mis pedidos
        </Link>
        <Link href={PUBLIC_ROUTES.CATALOG} className={cn(buttonVariants({ variant: 'outline' }))}>
          Seguir comprando
        </Link>
        <Button variant="secondary" onClick={() => window.print()} className="gap-2">
          <Printer className="size-4" aria-hidden />
          Imprimir
        </Button>
      </div>
    </div>
  );
}
