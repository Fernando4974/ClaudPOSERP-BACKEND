import { User } from '../../auth/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-images.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({ name: 'id ', example: '066d5fcf-8767-4b8b-bc60-b76bc26598c3' })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({ example: 'Producto de Prueba 1111' })
  @Column({ type: 'varchar', unique: true, length: 255 })
  title: string;
  @ApiProperty({
    example: ' Descripción detallada del producto número 1 para testing.',
  })
  @Column({ type: 'text', nullable: true })
  description: string;
  @ApiProperty({ example: 45.99 })
  @Column({ type: 'decimal', nullable: false, default: 0 })
  price: number;
  @ApiProperty({ example: 45 })
  @Column({ type: 'int', default: 0, nullable: true })
  stock: number;
  @ApiProperty({ example: 'producto_de_prueba_25' })
  @Column({ type: 'text', unique: true, nullable: true })
  slug: string;
  @ApiProperty({ example: 'telefonos' })
  @Column({ type: 'text', nullable: true })
  categorie: string;
  @ApiProperty({ example: '5449000000996 ' })
  @Column({ type: 'text', nullable: true, default: '0' })
  barcode?: string;
  @ApiProperty({
    description: 'El producto esta disponible el el punto de venta',
  })
  @Column({ type: 'boolean', nullable: true })
  posAvalible: boolean;
  @ApiProperty({ example: ['Electronico', 'Telefono', 'Negron'] })
  @Column({ type: 'text', nullable: true, array: true })
  tags: string[];
  @ApiProperty({
    example: 26,
    description:
      'numero de buscado rapido en punto de venta, del 1 al 50 tienen buscado rapido',
  })
  @Column({ type: 'int', nullable: true, default: null })
  numberKey?: number;
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user: User;
  @ApiProperty({
    type: () => ProductImage,
    description: 'id de la imagen del producto',
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @BeforeInsert()
  @BeforeUpdate()
  checkSlug() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quita acentos
      .replace(/_{2,}/g, '_') // Evita dobles guiones bajos
      .replace(/' '/, '_');
  }
}
