import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSaleItemDto } from './create-sale-item.dto';

export class CreateSaleDto {
  @IsNumber()
  total: number;

  @IsNumber()
  iva: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto del array
  @Type(() => CreateSaleItemDto) // Indica a qué clase debe transformar los objetos
  items: CreateSaleItemDto[];

  // El usuario normalmente se saca del JWT en el Controller,
  // pero si lo pasas manualmente:
  @IsUUID()
  @IsOptional()
  userId?: string;
}
