import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsUUID, IsNumber, IsPositive, Min } from 'class-validator';
import { Sale } from './sale.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sale_items')
export class SaleItem {
  @ApiProperty({ example: '001' })
  @PrimaryGeneratedColumn('increment')
  id: string;
  @ApiProperty()
  @Column({ nullable: true })
  title?: string;
  @ApiProperty()
  @Column()
  @IsUUID()
  productId: string; // ID del producto (puedes relacionarlo con Product si tienes esa entidad)
  @ApiProperty()
  @Column({ type: 'int' })
  @IsNumber()
  @Min(1)
  quantity: number;
  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @IsPositive()
  priceAtSale: number; // Importante: precio capturado en el momento de la venta
  @ApiProperty({ type: () => Sale })
  // Relación: Muchos ítems pertenecen a una Venta
  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
  sale: Sale;
}
