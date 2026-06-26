import { calculateOrderTotals, DEFAULT_STORE_SETTINGS } from './order-totals.util';

describe('calculateOrderTotals', () => {
  it('calcula IGV y envío', () => {
    const result = calculateOrderTotals(100, DEFAULT_STORE_SETTINGS);
    expect(result.tax).toBe(18);
    expect(result.shipping_cost).toBe(15);
    expect(result.total).toBe(133);
  });

  it('aplica envío gratis sobre umbral', () => {
    const result = calculateOrderTotals(250, DEFAULT_STORE_SETTINGS);
    expect(result.shipping_cost).toBe(0);
    expect(result.total).toBe(295);
  });
});
