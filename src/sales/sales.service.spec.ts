import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { User } from 'src/auth/entities/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

describe('SalesService', () => {
  let service: SalesService;
  let mockSalesRespository: any;

  beforeEach(async () => {
    mockSalesRespository = {
      create: jest.fn(),
      save: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: getRepositoryToken(Sale),
          useValue: mockSalesRespository,
        },
      ],
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
});
