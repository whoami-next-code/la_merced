import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateOrderDto } from './create-order.dto';

describe('CreateOrderDto', () => {
  it('rechaza pedidos sin items', async () => {
    const dto = plainToInstance(CreateOrderDto, { items: [] });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('acepta pedido válido', async () => {
    const dto = plainToInstance(CreateOrderDto, {
      items: [{ product_id: '550e8400-e29b-41d4-a716-446655440000', quantity: 2 }],
      payment_method: 'yape',
      shipping_address: 'Av. Principal 123',
      shipping_city: 'Lima',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
