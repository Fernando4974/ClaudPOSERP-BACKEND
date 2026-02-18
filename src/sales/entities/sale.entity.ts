import {
  IsNumber,
  IsPositive,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { SaleItem } from './sale-item.entity';
import { Type } from 'class-transformer';

@Entity('sales') // Es buena práctica nombrar la tabla en plural
export class Sale {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @IsPositive()
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @IsNumber()
  @IsPositive()
  iva: number;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string; // Ej: 'pending', 'completed', 'cancelled'

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sales)
  user: User;

  @OneToMany(() => SaleItem, (saleItem) => saleItem.sale, { cascade: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItem)
  items: SaleItem[];
}
