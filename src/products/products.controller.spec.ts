import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PassportModule } from '@nestjs/passport';

describe('ProductsController', () => {
  let controller: ProductsController;
  let mockProductsService: any;

  beforeEach(async () => {
    mockProductsService = {
      create: jest.fn().mockResolvedValue({ id: 'p1' }),
      findAll: jest.fn().mockResolvedValue([]),
      findNumberKey: jest.fn().mockResolvedValue({ exist: false }),
      update: jest.fn().mockResolvedValue({ message: 'ok' }),
      findOne: jest.fn().mockResolvedValue({ id: 'p1' }),
      remove: jest.fn().mockResolvedValue({ deletedId: 'p1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call productsService.create', async () => {
    const dto = { title: 't' } as any;
    const file = { originalname: 'img.jpg', buffer: Buffer.from('') } as any;
    const user = { id: 'u1' } as any;
    const res = await controller.create(file, dto, user);
    expect(mockProductsService.create).toHaveBeenCalledWith(dto, user, file);
    expect(res).toEqual({ id: 'p1' });
  });

  it('findAll should call productsService.findAll', async () => {
    const res = await controller.findAll({ limit: 1, offset: 0 } as any);
    expect(mockProductsService.findAll).toHaveBeenCalled();
    expect(res).toEqual([]);
  });

  it('findNumberKey should call productsService.findNumberKey', async () => {
    const res = await controller.findNumberKey('1');
    expect(mockProductsService.findNumberKey).toHaveBeenCalledWith(1);
    expect(res).toEqual({ exist: false });
  });

  it('update should call productsService.update', async () => {
    const res = await controller.update(
      'p1',
      { id: 'u1' } as any,
      { title: 'x' } as any,
      undefined,
    );
    expect(mockProductsService.update).toHaveBeenCalledWith(
      'p1',
      { id: 'u1' },
      { title: 'x' },
      undefined,
    );
    expect(res).toEqual({ message: 'ok' });
  });

  it('findOne should call productsService.findOne', async () => {
    const res = await controller.findOne('p1');
    expect(mockProductsService.findOne).toHaveBeenCalledWith('p1');
    expect(res).toEqual({ id: 'p1' });
  });

  it('remove should call productsService.remove', async () => {
    const res = await controller.remove('p1');
    expect(mockProductsService.remove).toHaveBeenCalledWith('p1');
    expect(res).toEqual({ deletedId: 'p1' });
  });
});
