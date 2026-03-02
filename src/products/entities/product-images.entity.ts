import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product_images' })
export class ProductImage {
  @ApiProperty({ example: 20, description: 'is autoincrement' })
  @PrimaryGeneratedColumn('increment')
  id: number;
  @ApiProperty({
    example:
      'https://res.cloudinary.com/dmekopag1/image/upload/v1770740980/hdxrj7brvujw7d0a6shx.jpg',
  })
  @Column('text', { nullable: false })
  url: string;
  @ApiProperty({
    example: 'cd9fe9d3-7933-4b19-a24f-0f1e6dfcb8b2',
    type: () => Product,
  })
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
