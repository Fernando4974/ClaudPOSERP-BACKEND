import { IsUUID, IsNumber, IsPositive, IsInt, Min } from 'class-validator';

export class CreateSaleItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsPositive()
  priceAtSale: number;
}
