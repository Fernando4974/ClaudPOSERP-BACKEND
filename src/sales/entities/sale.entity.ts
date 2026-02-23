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
import { ApiProperty } from '@nestjs/swagger';

@Entity('sales') // Es buena práctica nombrar la tabla en plural
export class Sale {
  @ApiProperty({
    example: '200',
    description: 'Is not a uuid',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: string;
  @ApiProperty({ example: 33 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @IsPositive()
  total: number;
  @ApiProperty({ example: 12 })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @IsNumber()
  @IsPositive()
  iva: number;
  @ApiProperty({ example: 'EFECTIVO' })
  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;
  @ApiProperty({})
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.sales)
  user: User;

  @ApiProperty({ type: () => SaleItem })
  @OneToMany(() => SaleItem, (saleItem) => saleItem.sale, { cascade: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItem)
  items: SaleItem[];
}
