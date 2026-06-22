'use client';

import Link from 'next/link';
import { useCart } from '@/providers/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <Link href={PUBLIC_ROUTES.CATALOG} className={cn(buttonVariants())}>
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Carrito de compras</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.productId}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">S/ {item.price.toFixed(2)} c/u</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button size="icon" variant="outline" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-semibold w-24 text-right">
                S/ {(item.price * item.quantity).toFixed(2)}
              </p>
              <Button size="icon" variant="ghost" onClick={() => removeItem(item.productId)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
        <Button variant="outline" onClick={clearCart}>Vaciar carrito</Button>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">S/ {total.toFixed(2)}</p>
        </div>
        <Link href={PUBLIC_ROUTES.LOGIN} className={cn(buttonVariants({ size: 'lg' }))}>
          Proceder al pago
        </Link>
      </div>
    </div>
  );
}
