import { IsUUID, IsNumber, IsInt, Min, IsString } from 'class-validator';

export class CreateSaleItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  title: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  priceAtSale: number;
}
