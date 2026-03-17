import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { User } from '../auth/entities/user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

describe('SalesService', () => {
  let service: SalesService;
  let mockSalesRespository: any;

  beforeEach(async () => {
    mockSalesRespository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: getRepositoryToken(Sale),
          useValue: mockSalesRespository,
        },
      ],
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    }).compile();

    service = module.get<SalesService>(SalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a sale whit props values', async () => {
    const createUserDto: CreateUserDto = {
      email: 'Fernando@gmail.com',
      password: 'fernando123A',
      name: 'Fernando',
      lastname: 'Villarreal',
    };
    const user = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      ...createUserDto,
    } as User;

    const items: CreateSaleItemDto[] = [
      {
        productId: '550e8400-e29b-41d4-a716-446655440000',
        title: 'iphone',
        quantity: 2,
        priceAtSale: 2000,
      },
    ];

    const createSaleDto: CreateSaleDto = {
      total: 3000,
      iva: 12,
      status: 'EFECTIVO',
      items: items,
    };

    const saleCreated = {
      id: '12',
      ...createSaleDto,
      user,
    };

    mockSalesRespository.create.mockReturnValue(saleCreated);
    mockSalesRespository.save.mockResolvedValue(saleCreated);
    const sale = await service.create(user, createSaleDto);
    expect(mockSalesRespository.create).toHaveBeenCalledWith({
      ...createSaleDto,
      user,
    });
    expect(sale).toEqual(saleCreated);
  });

  it('findAll should return cached results on subsequent calls', async () => {
    const user = { id: 'u1' } as User;
    const spy = jest
      .spyOn(mockSalesRespository, 'find')
      .mockResolvedValueOnce([{ id: 's1' } as any]);

    const first = await service.findAll(user, { limit: 1, offset: 0 });
    const second = await service.findAll(user, { limit: 1, offset: 0 });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(first).toEqual(second);
  });

  it('findOne should throw BadRequestException when id is "create"', async () => {
    await expect(service.findOne('create')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('findOne should throw NotFoundException when sale not exists', async () => {
    jest.spyOn(mockSalesRespository, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findOne('non-exist-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('remove should delete an existing sale and return message', async () => {
    const saleToDelete = { id: '10' } as any;
    jest
      .spyOn(mockSalesRespository, 'findOne')
      .mockResolvedValueOnce(saleToDelete);
    jest.spyOn(mockSalesRespository, 'remove').mockResolvedValueOnce(undefined);

    const res = await service.remove('10');
    expect(res).toEqual({
      message: `Sale #10 has been deleted successfully`,
      deletedId: '10',
    });
  });

  it('salesDay should return array of sales for today', async () => {
    const user = { id: 'u1' } as User;
    const todaySales = [{ id: 's1' } as any];
    jest.spyOn(mockSalesRespository, 'find').mockResolvedValueOnce(todaySales);
    const res = await service.salesDay(user);
    expect(res).toEqual(todaySales);
  });
});
