import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './auth/entities/user.entity';
import { ProductImage } from './products/entities/product-images.entity';
import { Product } from './products/entities/product.entity';
import { Sale } from './sales/entities/sale.entity';
import { SaleItem } from './sales/entities/sale-item.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  ssl: process.env.STAGE === 'prod',
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT! || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Product, ProductImage, Sale, SaleItem],

  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
