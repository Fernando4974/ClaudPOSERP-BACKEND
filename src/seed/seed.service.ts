import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { SEED_DATA } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async executeSeed() {
    try {
      // 1. Limpiar base de datos
      await this.deleteTables();

      // 2. Crear las instancias de productos
      const products = SEED_DATA.map((data) => {
        const { images, user, ...productDetails } = data;

        return this.productRepository.create({
          ...productDetails,
          images: images.map((url) => ({ url })), // Transforma strings a objetos ProductImage
          user: { id: user } as any, // Asigna el ID del usuario
        });
      });

      // 3. Guardar todo el arreglo de una vez
      await this.productRepository.save(products);

      return `Seed ejecutado con éxito: ${products.length} productos creados.`;
    } catch (error) {
      console.error('ERROR SEED:', error);
      throw new InternalServerErrorException(
        'Error al insertar el seed. Mira la terminal.',
      );
    }
  }

  private async deleteTables() {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    try {
      // Borra todos los productos (las imágenes se borran por Cascada si está configurado)
      await queryBuilder.delete().where({}).execute();
    } catch (error) {
      console.log('Error al limpiar:', error.message);
    }
  }
}
