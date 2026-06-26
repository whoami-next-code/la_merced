'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCart } from '@/providers/cart-provider';
import { useApi } from '@/hooks/use-api';
import { createClient } from '@/lib/supabase/client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { OrderTotalsSummary } from '@/components/public/order-totals-summary';

const PAYMENT_METHODS = [
  { value: 'transfer', label: 'Transferencia bancaria' },
  { value: 'yape', label: 'Yape' },
  { value: 'plin', label: 'Plin' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'cash', label: 'Efectivo contra entrega' },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { api } = useApi();
  const { items, total, clearCart } = useCart();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]['value']>('transfer');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .maybeSingle();
        const { data: customer } = await supabase
          .from('customers')
          .select('address, city')
          .eq('user_id', user.id)
          .maybeSingle();
        if (customer?.address) setShippingAddress(customer.address);
        if (customer?.city) setShippingCity(customer.city);
        void profile;
      }
      setAuthChecked(true);
    }
    void checkAuth();
  }, []);

  const checkout = useMutation({
    mutationFn: () =>
      api<{ order_number: string; id: string }>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
          payment_method: paymentMethod,
          shipping_address: shippingAddress,
          shipping_city: shippingCity,
          notes: notes || undefined,
        }),
      }),
    onSuccess: (order) => {
      clearCart();
      toast.success(`Pedido ${order.order_number} registrado correctamente`);
      router.push(`${PUBLIC_ROUTES.ORDER_CONFIRMATION}?numero=${order.order_number}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No hay productos para checkout</h1>
        <Link href={PUBLIC_ROUTES.CATALOG} className={cn(buttonVariants())}>
          Ir al catálogo
        </Link>
      </div>
    );
  }

  if (!authChecked) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Verificando sesión…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Inicia sesión para continuar</h1>
        <p className="text-muted-foreground mb-6">
          Debes tener una cuenta para finalizar tu compra de forma segura.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`${PUBLIC_ROUTES.LOGIN}?redirect=${encodeURIComponent(PUBLIC_ROUTES.CHECKOUT)}`}
            className={cn(buttonVariants())}
          >
            Iniciar sesión
          </Link>
          <Link href={PUBLIC_ROUTES.REGISTER} className={cn(buttonVariants({ variant: 'outline' }))}>
            Crear cuenta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar compra</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumen del pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-medium tabular-nums">S/ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3">
              <OrderTotalsSummary subtotal={total} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Envío y pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Dirección de envío</Label>
              <Input
                id="address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={shippingCity}
                onChange={(e) => setShippingCity(e.target.value)}
                required
              />
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Método de pago</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.value}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm',
                      paymentMethod === method.value && 'border-primary bg-primary/5',
                    )}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="size-4"
                    />
                    {method.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Link href={PUBLIC_ROUTES.CART} className={cn(buttonVariants({ variant: 'outline' }), 'text-center')}>
            Volver al carrito
          </Link>
          <Button
            size="lg"
            className="w-full sm:w-auto"
            disabled={checkout.isPending || !shippingAddress.trim() || !shippingCity.trim()}
            onClick={() => checkout.mutate()}
          >
            {checkout.isPending ? 'Procesando…' : 'Confirmar pedido'}
          </Button>
        </div>
      </div>
    </div>
  );
}
