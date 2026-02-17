import { Injectable } from '@nestjs/common';
import { SEED_DATA } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async executeSeed() {
    // IDs extraídos de tus tokens
    const userIds = [
      '06276ef1-2081-424b-a470-e3df88021b6a',
      'c75a1324-b26d-4a65-975e-6c5c389e8aca',
    ];

    const productsToInsert = SEED_DATA.map((seedProduct, index) => {
      // Repartimos los productos entre los 2 usuarios
      const userId = userIds[index % 2 === 0 ? 0 : 1];

      // Creamos la instancia del producto
      const product = this.productRepository.create({
        ...seedProduct,
        user: { id: userId }, // Relación ManyToOne
        images: seedProduct.images.map((url) => ({ url })), // Relación OneToMany
      });

      return product;
    });

    // Limpieza y carga (Cuidado en producción)
    await this.productRepository.save(productsToInsert);

    return 'Seed ejecutado con éxito: 30 productos creados.';
  }
}
