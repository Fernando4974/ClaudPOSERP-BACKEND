import {
  IsUUID,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  IsString,
} from 'class-validator';

export class CreateSaleItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  title: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsPositive()
  priceAtSale: number;
}
