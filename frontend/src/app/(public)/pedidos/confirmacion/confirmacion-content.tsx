'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { ordersService } from '@/services/catalog.service';
import { Button, buttonVariants } from '@/components/ui/button';
import { OrderReceipt } from '@/components/public/order-receipt';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

export function ConfirmacionContent() {
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    setOrderNumber(new URLSearchParams(window.location.search).get('numero') ?? '');
  }, []);

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

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 print:py-4">
      <div className="mb-8 text-center print:mb-4">
        <CheckCircle2 className="mx-auto mb-4 size-12 text-green-600" aria-hidden />
        <h1 className="text-3xl font-bold">¡Compra exitosa!</h1>
        <p className="mt-2 text-muted-foreground">
          Tu pedido ha sido registrado correctamente.
        </p>
      </div>

      <OrderReceipt order={order} />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center print:hidden">
        <Link href={PUBLIC_ROUTES.ORDERS} className={cn(buttonVariants())}>
          Ver mis pedidos
        </Link>
        <Link href={PUBLIC_ROUTES.CATALOG} className={cn(buttonVariants({ variant: 'outline' }))}>
          Seguir comprando
        </Link>
        <Button variant="secondary" onClick={() => window.print()}>
          Imprimir comprobante
        </Button>
      </div>
    </div>
  );
}
