'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ordersService } from '@/services/catalog.service';

const trackSchema = z.object({
  order_number: z.string().min(5, 'Número de pedido inválido'),
});

type TrackInput = z.infer<typeof trackSchema>;

export default function SeguimientoPage() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TrackInput>({
    resolver: zodResolver(trackSchema),
  });

  async function onSubmit(data: TrackInput) {
    setError(null);
    setResult(null);
    try {
      const order = await ordersService.track(data.order_number);
      setResult(order as Record<string, unknown>);
    } catch {
      setError('Pedido no encontrado. Verifica el número e intenta de nuevo.');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-2">Seguimiento de pedido</h1>
      <p className="text-muted-foreground mb-8">Ingresa tu número de pedido (ej: P-20250621-00001)</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="order_number">Número de pedido</Label>
          <Input id="order_number" {...register('order_number')} placeholder="P-YYYYMMDD-00001" />
          {errors.order_number && (
            <p className="text-sm text-destructive mt-1">{errors.order_number.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Consultando...' : 'Consultar estado'}
        </Button>
      </form>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {result && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Pedido {String(result.order_number)}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Estado:</strong> {String(result.status)}</p>
            <p><strong>Total:</strong> S/ {Number(result.total).toFixed(2)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
