import { plainToClass } from 'class-transformer';
import { CreateSaleDto } from './create-sale.dto';
import { validate } from 'class-validator';
import { CreateSaleItemDto } from './create-sale-item.dto';

describe('CreateSaleDto', () => {
  it('Sould be validate whit all props values', async () => {
    const saleIntem: CreateSaleItemDto[] = [
      {
        productId: '550e8400-e29b-41d4-a716-446655440000',
        title: 'iphone',
        quantity: 2,
        priceAtSale: 200,
      },
    ];
    const input = {
      total: 200,
      iva: 12,
      status: 'EFECTIVO',
      items: saleIntem,
    };
    const dto = plainToClass(CreateSaleDto, input);
    const error = await validate(dto);
    console.log(error);
    expect(error.length).toBe(0);
  });
  it('Should validated only whit required params', async () => {
    const items: CreateSaleItemDto[] = [
      {
        productId: '550e8400-e29b-41d4-a716-446655440000',
        title: 'iphone',
        quantity: 2,
        priceAtSale: 200,
      },
    ];
    const input = { total: 3000, iva: 12, status: 'efectivo', items };
    const dto = plainToClass(CreateSaleDto, input);
    const error = await validate(dto);
    expect(error.length).toBe(0);
  });
  //Ojo Este test demostro que en teoria una venta sin items seria una venta valida
  it('Should validated whitout items', async () => {
    const input = { total: 3000, iva: 12, status: 'efectivo' };
    const dto = plainToClass(CreateSaleDto, input);
    const error = await validate(dto);
    const props = error.find((e) => e.property === 'iva');
    expect(props).toBeUndefined();
  });
});
