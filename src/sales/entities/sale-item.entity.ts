import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsUUID, IsNumber, IsPositive, Min } from 'class-validator';
import { Sale } from './sale.entity';

@Entity('sale_items')
export class SaleItem {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ nullable: true })
  title?: string;

  @Column()
  @IsUUID()
  productId: string; // ID del producto (puedes relacionarlo con Product si tienes esa entidad)

  @Column({ type: 'int' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @IsPositive()
  priceAtSale: number; // Importante: precio capturado en el momento de la venta

  // Relación: Muchos ítems pertenecen a una Venta
  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
  sale: Sale;
}
