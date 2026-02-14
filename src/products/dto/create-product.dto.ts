import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  title: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  barcode?: string;
  @IsNumber()
  price: number;
  @IsNumber()
  @IsOptional()
  stock?: number;
  @IsOptional()
  @IsString()
  slug?: string;
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  tags?: string[];
  @IsOptional()
  @ValidateIf((object, value) => value !== '' && value !== null)
  @IsNumber()
  @Min(1)
  @Max(25)
  numberKey?: number;
  @IsBoolean()
  @IsOptional()
  posAvalible?: boolean;
  @IsString()
  @IsOptional()
  categorie: string;
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string;
}
