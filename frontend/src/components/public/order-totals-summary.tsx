'use client';

import { calculateOrderTotals, useStoreSettings } from '@/hooks/use-store-settings';

export function useOrderTotals(subtotal: number) {
  const { data: settings } = useStoreSettings();
  return calculateOrderTotals(subtotal, settings!);
}

export function OrderTotalsSummary({ subtotal }: { subtotal: number }) {
  const { tax, shipping, total } = useOrderTotals(subtotal);
  const { data: settings } = useStoreSettings();

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="tabular-nums">S/ {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">IGV ({settings?.tax_rate ?? 18}%)</span>
        <span className="tabular-nums">S/ {tax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Envío</span>
        <span className="tabular-nums">
          {shipping === 0 ? 'Gratis' : `S/ ${shipping.toFixed(2)}`}
        </span>
      </div>
      {settings && subtotal < settings.free_shipping_min && subtotal > 0 ? (
        <p className="text-xs text-muted-foreground">
          Envío gratis en compras desde S/ {settings.free_shipping_min.toFixed(2)}
        </p>
      ) : null}
      <div className="flex justify-between border-t pt-2 font-bold text-base">
        <span>Total</span>
        <span className="tabular-nums">S/ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}
