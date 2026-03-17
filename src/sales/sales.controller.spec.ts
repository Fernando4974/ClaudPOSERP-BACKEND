import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { PassportModule } from '@nestjs/passport';

describe('SalesController', () => {
  let controller: SalesController;
  let mockSalesService: any;

  beforeEach(async () => {
    mockSalesService = {
      create: jest.fn().mockResolvedValue({ id: 's1' }),
      findAll: jest.fn().mockResolvedValue([]),
      salesDay: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({ id: 's1' }),
      update: jest.fn().mockResolvedValue({ message: 'updated' }),
      remove: jest
        .fn()
        .mockResolvedValue({ message: 'deleted', deletedId: 's1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [{ provide: SalesService, useValue: mockSalesService }],
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    }).compile();

    controller = module.get<SalesController>(SalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call salesService.create', async () => {
    const user = { id: 'u1' } as any;
    const dto = { total: 100 } as any;
    const res = await controller.create(user, dto);
    expect(mockSalesService.create).toHaveBeenCalledWith(user, dto);
    expect(res).toEqual({ id: 's1' });
  });

  it('findAll should call salesService.findAll', async () => {
    const user = { id: 'u1' } as any;
    const res = await controller.findAll(user, { limit: 1, offset: 0 } as any);
    expect(mockSalesService.findAll).toHaveBeenCalledWith(user, {
      limit: 1,
      offset: 0,
    });
    expect(res).toEqual([]);
  });

  it('salesDay should call salesService.salesDay', async () => {
    const user = { id: 'u1' } as any;
    const res = await controller.salesDay(user);
    expect(mockSalesService.salesDay).toHaveBeenCalledWith(user);
    expect(res).toEqual([]);
  });

  it('findOne should call salesService.findOne', async () => {
    const res = await controller.findOne('1');
    expect(mockSalesService.findOne).toHaveBeenCalledWith('1');
    expect(res).toEqual({ id: 's1' });
  });

  it('remove should call salesService.remove', async () => {
    const user = { id: 'u1' } as any;
    const res = await controller.remove(user, 's1');
    expect(mockSalesService.remove).toHaveBeenCalledWith('s1');
    expect(res).toEqual({ message: 'deleted', deletedId: 's1' });
  });
});
