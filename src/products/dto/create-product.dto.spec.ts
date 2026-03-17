import { plainToClass } from 'class-transformer';
import { CreateProductDto } from './create-product.dto';
import { validate } from 'class-validator';

describe('CreateProductDto', () => {
  it('Should be valitade whit all correct params', async () => {
    const input = {
      title: 'Telefono',
      description: 'Azul',
      barcode: 'fscd22544dd586asffs4',
      price: 222,
      stock: 2,
      slug: 'Telefono',
      tags: ['samsung', 'a10'],
      numberKey: 2,
      posAvalible: true,
      categorie: 'smartphones',
      images: ['https://imgages.jpg', 'https: //images2.jpg'],
    };
    const dto = plainToClass(CreateProductDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Should be valitade whit only required params', async () => {
    const input = {
      title: 'Telefono',
      price: 222,
    };
    const dto = plainToClass(CreateProductDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Should not valitade if title is not string', async () => {
    const input = {
      title: 896547,
      price: 222,
    };
    const dto = plainToClass(CreateProductDto, input);
    const errors = await validate(dto);
    const props = errors.find((e) => e.property === 'title');
    expect(props).toBeDefined();
    expect(props?.constraints?.isString).toBeDefined();
    expect(props?.constraints?.minLength).toBeDefined();
    expect(props?.constraints?.maxLength).toBeDefined();
    const otherErrors = errors.filter((e) => e.property !== 'title');
    expect(otherErrors.length).toBe(0);
  });
  it('Should not valitade if title length is less to 2', async () => {
    const input = {
      title: 'a',
      price: 222,
    };
    const dto = plainToClass(CreateProductDto, input);
    const errors = await validate(dto);
    const props = errors.find((e) => e.property === 'title');
    expect(props).toBeDefined();
    expect(props?.constraints?.minLength).toBeDefined();
    const otherErrors = errors.filter((e) => e.property !== 'title');
    expect(otherErrors.length).toBe(0);
  });
  it('Should not valitade if title is longest than 255', async () => {
    const input = {
      title: 'A'.repeat(257),
      price: 222,
    };
    const dto = plainToClass(CreateProductDto, input);
    const errors = await validate(dto);
    const props = errors.find((e) => e.property === 'title');
    expect(props).toBeDefined();
    expect(props?.constraints?.maxLength).toBeDefined();
    const otherErrors = errors.filter((e) => e.property !== 'title');
    expect(otherErrors.length).toBe(0);
  });
  it('Should not validate if description is not a string', async () => {
    const input = { title: 'aa', price: 2, description: 111 };
    const dto = plainToClass(CreateProductDto, input);
    const errors = await validate(dto);
    console.log(errors);
    const props = errors.find((e) => e.property === 'description');
    expect(props).toBeDefined();
    expect(props?.constraints?.isString).toBeDefined();
    const otherErrors = errors.filter((e) => e.property !== 'description');
    console.log(otherErrors);
    expect(otherErrors.length).toBe(0);
  });
  it('Shoul not validate if barcode is not string', async () => {
    const input = { title: 'aaa', price: 2, barcode: 111 };
    const dto = plainToClass(CreateProductDto, input);
    const errors = await validate(dto);
    const props = errors.find((e) => e.property === 'barcode');
    expect(props).toBeDefined();
    expect(props?.constraints?.isString).toBeDefined();
    const otherErrors = errors.filter((e) => e.property !== 'barcode');
    expect(otherErrors.length).toBe(0);
  });
  it('Shoul not validate if price is not a number', async () => {
    const input = { title: 'aaa', price: '300' };
    const dto = plainToClass(CreateProductDto, input);

    const errors = await validate(dto);
    const props = errors.find((e) => e.property === 'price');
    expect(props).toBeDefined();
    expect(props?.constraints?.isNumber);
    const otherErrors = errors.filter((e) => e.property !== 'price');
    expect(otherErrors.length).toBe(0);
  });
});
