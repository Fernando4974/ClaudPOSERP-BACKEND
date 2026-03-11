import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-images.entity';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductRepo: any;
  let mockImagesRepo: any;
  let mockCloudinary: any;

  beforeEach(async () => {
    // mock the repositories and cloudinary service the service depends on
    mockProductRepo = {
      findOneBy: jest.fn().mockResolvedValue({ id: '1', title: 'iphone' }),
    };
    mockImagesRepo = {
      // add any methods you need later
      delete: jest.fn(),
    };
    mockCloudinary = {
      uploadFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
        {
          provide: getRepositoryToken(ProductImage),
          useValue: mockImagesRepo,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinary,
        },
      ],
    }).compile();
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return a product by id', async () => {
    const product = await service.findOne('1');
    expect(product).toEqual({
      id: '1',
      title: 'iphone',
    });
    expect(mockProductRepo.findOneBy).toHaveBeenCalledWith({ id: '1' });
  });
});
