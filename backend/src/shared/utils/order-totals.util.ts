export interface StoreSettings {
  currency: string;
  tax_rate: number;
  shipping_flat: number;
  free_shipping_min: number;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  currency: 'PEN',
  tax_rate: 18,
  shipping_flat: 15,
  free_shipping_min: 200,
};

export function calculateOrderTotals(subtotal: number, settings: StoreSettings) {
  const tax = Math.round(subtotal * (settings.tax_rate / 100) * 100) / 100;
  const shipping =
    subtotal >= settings.free_shipping_min ? 0 : settings.shipping_flat;
  const total = Math.round((subtotal + tax + shipping) * 100) / 100;
  return { subtotal, tax, shipping_cost: shipping, total };
}
