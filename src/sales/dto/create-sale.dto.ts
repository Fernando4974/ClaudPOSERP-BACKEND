import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSaleItemDto } from './create-sale-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDto {
  //Total
  @ApiProperty({ example: 201, description: 'Is Autoincrement' })
  @IsNumber()
  total: number;
  //Iva
  @ApiProperty({ example: 12.0, nullable: true })
  @IsNumber()
  iva: number;
  //status
  @ApiProperty({
    example: 'EFECTIVO',
    description: 'Definido por los botones CH, CHK, CA/AMT',
    nullable: false,
  })
  @IsString()
  @IsOptional()
  status?: string;
  //Items
  @ApiProperty({
    example: [
      {
        id: 283,
        productId: '066d5fcf-8767-4b8b-bc60-b76bc26598c3',
        title: 'Producto de Prueba 1111',
        quantity: 1,
        priceAtSale: '31.00',
      },
      {
        id: 284,
        productId: '08a480ca-0828-4e1f-9184-e143b0541364',
        title: 'Producto de Prueba 22',
        quantity: 1,
        priceAtSale: '57.00',
      },
      {
        id: 285,
        productId: '1a5dfd51-4c2a-477d-90db-3f81e3209180',
        title: 'Producto de Prueba 8',
        quantity: 1,
        priceAtSale: '96.00',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto del array
  @Type(() => CreateSaleItemDto) // Indica a qué clase debe transformar los objetos
  items: CreateSaleItemDto[];
}
