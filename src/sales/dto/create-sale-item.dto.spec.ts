import { plainToClass } from 'class-transformer';
import { CreateSaleItemDto } from './create-sale-item.dto';
import { validate } from 'class-validator';

describe('Create-sale-item.ts', () => {
  it('Should validate whits valid props, avery props', async () => {
    const input = {
      productId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'iphone',
      quantity: 1,
      priceAtSale: 2000,
    };
    const dto = plainToClass(CreateSaleItemDto, input);
    const error = await validate(dto);
    expect(error.length).toBe(0);
  });
  it('Should not validate whitout valid props, any props', async () => {
    const input = {};
    const dto = plainToClass(CreateSaleItemDto, input);
    const error = await validate(dto);
    console.log(error);
    expect(error.length).toBeGreaterThan(0);
    const props = error.map((e) => e.property);
    expect(props.includes('productId'));
    expect(props.includes('title'));
    expect(props.includes('quantity'));
    expect(props.includes('priceAtSale'));
    expect(props.length).toBe(4);
  });
});
