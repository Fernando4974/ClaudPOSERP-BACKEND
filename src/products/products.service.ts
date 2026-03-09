import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-images.entity';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    user: User,
    file?: Express.Multer.File, // Marcado como opcional
  ) {
    const { ...productDetails } = createProductDto;
    try {
      let productImages: ProductImage[] = [];

      // 1. Solo intentamos subir a Cloudinary si el archivo existe
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        const urlImage = uploadResult.secure_url;

        const productImage = this.productImagesRepository.create({
          url: urlImage,
        });

        productImages = [productImage];
      }

      // 2. Creamos el producto (si no hubo file, images será un array vacío [])
      const product = this.productsRepository.create({
        ...productDetails,
        user,
        images: productImages,
      });

      await this.productsRepository.save(product);
      this.paginatedProductCache.clear();
      return product;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }
  paginatedProductCache = new Map<string, Product[]>();

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto || {};
    const cacheKey = `${limit}-${offset}`;
    if (this.paginatedProductCache.has(cacheKey)) {
      return this.paginatedProductCache.get(cacheKey)!;
    }
    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
    });
    this.paginatedProductCache.set(cacheKey, products);
    return products;
  }

  async findOne(id: string) {
    return await this.productsRepository.findOneBy({ id });
  }

  async update(
    id: string,
    user: User,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    const product = await this.productsRepository.findOneBy({ id });
    const { ...productDetails } = updateProductDto;
    if (!product) {
      throw new NotFoundException(
        `No se encontro el producto con el id: ${id}`,
      );
    }
    // console.log('file:', file);
    let productImages: ProductImage[] = [];
    try {
      // console.log(file);
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        const urlImage = uploadResult.secure_url;
        await this.productImagesRepository.delete({
          product: { id },
        });
        const productImage = this.productImagesRepository.create({
          url: urlImage,
        });

        productImages = [productImage];
        // console.log('productImages1', productImages);
      }
      // console.log('productImages2', productImages);
      const productToUpdate = await this.productsRepository.preload({
        id,
        ...(productDetails as any),
        user,
        images: productImages,
      });
      // console.log('productToUpdate back serice', productToUpdate?.images);
      if (!productToUpdate)
        throw new NotFoundException(`Product #${id} not found`);
      await this.productsRepository.save(productToUpdate);
      return {
        message: 'Producto actualizado con éxito',
        product: productToUpdate,
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const productToDelete = await this.productsRepository.findOneBy({ id });

    if (productToDelete) {
      await this.productsRepository.remove(productToDelete);
    } else {
      throw new NotFoundException();
    }
  }
  async findNumberKey(numberKey: number) {
    const valideNumberKey = await this.productsRepository.findOneBy({
      numberKey,
    });
    if (valideNumberKey) {
      return { exist: true };
    } else {
      return { exist: false };
    }
  }
  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      // console.log(error);
      throw new ConflictException('Product is already exist');
    }

    throw new InternalServerErrorException(
      'Database error occurred' + error.message,
    );
  }
}
