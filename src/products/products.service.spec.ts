import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-images.entity';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { User } from '../auth/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductRepo: any;
  let mockImagesRepo: any;
  let mockCloudinary: any;

  beforeEach(async () => {
    // mock the repositories and cloudinary service the service depends on
    mockProductRepo = {
      findOneBy: jest.fn().mockResolvedValue({
        id: '066d5fcf-8767-4b8b-bc60-b76bc26598c3',
        title: 'iphone',
        categorie: 'movil',
      }),
      remove: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn().mockRejectedValue([
        {
          id: '066d5fcf-8767-4b8b-bc60-b76bc26598c3',
          title: 'iphone',
          categorie: 'movil',
        },
      ]),
    };
    mockImagesRepo = {
      create: jest.fn(),
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
    const product = await service.findOne(
      '066d5fcf-8767-4b8b-bc60-b76bc26598c3',
    );
    expect(product).toEqual({
      id: '066d5fcf-8767-4b8b-bc60-b76bc26598c3',
      title: 'iphone',
      categorie: 'movil',
    });
    expect(mockProductRepo.findOneBy).toHaveBeenCalledWith({
      id: '066d5fcf-8767-4b8b-bc60-b76bc26598c3',
    });
  });
  it('should create a new product', async () => {
    const createUserDto: CreateUserDto = {
      email: 'Fernando@gmail.com',
      password: 'fernando123A',
      name: 'Fernando',
      lastname: 'Villarreal',
    };
    const user = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      roles: ['Admin'],
      isActive: true,
      membershipStart: new Date('2026-11-10'),
      membershipEnd: new Date('2026-11-10'),
      ...createUserDto,
    } as User;
    const createProductDto = {
      title: 'telefono',
      price: 2000,
      categorie: 'movil',
    };
    const createdProduct = {
      id: '066d5fcf-8767-4b8b-bc60-b76bc26598c3',
      ...createProductDto,
      user,
      images: [],
    };

    mockProductRepo.create.mockReturnValue(createdProduct);
    mockProductRepo.save.mockResolvedValue(createdProduct);

    const product = await service.create(createProductDto, user);

    expect(mockProductRepo.create).toHaveBeenCalledWith({
      ...createProductDto,
      user,
      images: [],
    });
    expect(mockProductRepo.save).toHaveBeenCalledWith(createdProduct);
    expect(product).toEqual(createdProduct);
  });

  it('Shoud delete a product (remove)', async () => {
    const idProductToDelteMocked = '066d5fcf-8767-4b8b-bc60-b76bc26598c3';
    const productDeleted = await service.findOne(idProductToDelteMocked);
    expect(productDeleted).toEqual({
      id: '066d5fcf-8767-4b8b-bc60-b76bc26598c3',
      title: 'iphone',
      categorie: 'movil',
    });
    expect(mockProductRepo.findOneBy).toHaveBeenCalledWith({
      id: idProductToDelteMocked,
    });
    await service.remove(idProductToDelteMocked);
    expect(mockProductRepo.remove).toHaveBeenCalled();
  });

  it('Shoud not delete a product if do not exist (remove)', async () => {
    const idProductToDelteMocked = '2';
    jest.spyOn(mockProductRepo, 'findOneBy').mockResolvedValue(null);
    await expect(service.remove(idProductToDelteMocked)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockProductRepo.remove).not.toHaveBeenCalled();
  });
  it('Should return all a products whit pagination (findAll)', async () => {
    const paginationDto: PaginationDto = { limit: 1, offset: 0 };
    const spy = jest.spyOn(mockProductRepo, 'find').mockResolvedValue([]);
    await service.findAll(paginationDto);
    expect(spy).toHaveBeenCalled();
  });
  it('should create a product when file is provide', async () => {
    const createdProductDto = {
      title: 'telefono',
      price: 2000,
      categorie: 'movil',
    };
    const file = {
      originalname: 'img.jpg',
      buffer: Buffer.from(''),
    } as Express.Multer.File;
    mockCloudinary.uploadFile.mockResolvedValue({
      secure_url: 'http://image.jpg',
    });
    mockImagesRepo.create = jest
      .fn()
      .mockReturnValue({ url: 'http://image.jpg' });
    const productWithImage = {
      id: 'id-with-image',
      ...createdProductDto,
      user: { id: 'u1' },
      images: [{ url: 'http://image.jpg' }],
    };
    mockProductRepo.create.mockReturnValue(productWithImage);
    mockProductRepo.save.mockResolvedValue(productWithImage);
    const result = await service.create(
      createdProductDto as any,
      { id: 'u1' } as any,
      file,
    );
    expect(mockCloudinary.uploadFile).toHaveBeenCalledWith(file);
    expect(mockImagesRepo.create).toHaveBeenCalledWith({
      url: 'http://image.jpg',
    });
    expect(mockProductRepo.create).toHaveBeenCalledWith({
      ...createdProductDto,
      user: { id: 'u1' },
      images: [{ url: 'http://image.jpg' }],
    });
    expect(mockProductRepo.save).toHaveBeenCalledWith(productWithImage);
    expect(result).toEqual(productWithImage);
  });
  it('should update a product without file', async () => {
    const id = 'p-1';
    const updateDto = { title: 'nuevo' };
    const existing = { id, title: 'old', categorie: 'movil' };
    const updated = { id, title: 'nuevo', categorie: 'movil' };
    mockProductRepo.findOneBy.mockResolvedValue(existing);
    mockProductRepo.preload = jest.fn().mockResolvedValue(updated);
    mockProductRepo.save.mockResolvedValue(updated);

    const res = await service.update(id, { id: 'u1' } as any, updateDto as any);

    expect(mockProductRepo.findOneBy).toHaveBeenCalledWith({ id });
    expect(mockProductRepo.preload).toHaveBeenCalled();
    expect(mockProductRepo.save).toHaveBeenCalledWith(updated);
    expect(res).toEqual({
      message: 'Producto actualizado con éxito',
      product: updated,
    });
  });

  it('should update a product with file (replace images)', async () => {
    const id = 'p-2';
    const updateDto = { title: 'con-imagen' };
    const existing = { id, title: 'old' };
    const uploadRes = { secure_url: 'http://new.img' };
    mockProductRepo.findOneBy.mockResolvedValue(existing);
    mockCloudinary.uploadFile.mockResolvedValue(uploadRes);
    mockImagesRepo.delete.mockResolvedValue(undefined);
    mockImagesRepo.create = jest
      .fn()
      .mockReturnValue({ url: uploadRes.secure_url });
    const updated = {
      id,
      title: 'con-imagen',
      images: [{ url: uploadRes.secure_url }],
    };
    mockProductRepo.preload = jest.fn().mockResolvedValue(updated);
    mockProductRepo.save.mockResolvedValue(updated);

    const res = await service.update(
      id,
      { id: 'u1' } as any,
      updateDto as any,
      {} as Express.Multer.File,
    );

    expect(mockCloudinary.uploadFile).toHaveBeenCalled();
    expect(mockImagesRepo.delete).toHaveBeenCalledWith({ product: { id } });
    expect(mockImagesRepo.create).toHaveBeenCalledWith({
      url: uploadRes.secure_url,
    });
    expect(mockProductRepo.save).toHaveBeenCalledWith(updated);
    expect(res.product).toEqual(updated);
  });

  it('should return exist true/false for findNumberKey', async () => {
    jest
      .spyOn(mockProductRepo, 'findOneBy')
      .mockResolvedValueOnce({ numberKey: 1 } as any);
    expect(await service.findNumberKey(1)).toEqual({ exist: true });

    jest.spyOn(mockProductRepo, 'findOneBy').mockResolvedValueOnce(null);
    expect(await service.findNumberKey(2)).toEqual({ exist: false });
  });

  it('findAll should use cache on subsequent calls', async () => {
    const paginationDto = { limit: 1, offset: 0 };
    const spy = jest.spyOn(mockProductRepo, 'find').mockResolvedValue([]);
    const first = await service.findAll(paginationDto);
    const second = await service.findAll(paginationDto);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(first).toEqual(second);
  });
});
