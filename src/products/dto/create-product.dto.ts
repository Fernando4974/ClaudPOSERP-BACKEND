import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Título o nombre del producto',
    example: 'Teclado Mecánico RGB',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Teclado con switches rojos y retroiluminación',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Código de barras del producto',
    example: '750123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({
    description: 'Precio de venta',
    example: 85000,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 50,
    default: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'URL amigable del producto',
    example: 'teclado-mecanico-rgb',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    description: 'Etiquetas para búsqueda y filtrado',
    example: ['tecnologia', 'gaming'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  tags?: string[];

  @ApiProperty({
    description: 'Número de tecla rápida asignada en el POS',
    example: 5,
    minimum: 1,
    maximum: 25,
    required: false,
  })
  @IsOptional()
  @ValidateIf((object, value) => value !== '' && value !== null)
  @IsNumber()
  @Min(1)
  @Max(25)
  numberKey?: number;

  @ApiProperty({
    description: 'Define si el producto aparecerá en la interfaz de caja',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  posAvalible?: boolean;

  @ApiProperty({
    description: 'Categoría a la que pertenece el producto',
    example: 'Periféricos',
    required: false,
  })
  @IsString()
  @IsOptional()
  categorie: string;

  @ApiProperty({
    description: 'URLs de las imágenes del producto',
    example: ['https://foto.com/prod1.jpg'],
    type: [String],
    required: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[]; // Corregido a array de strings para coincidir con @IsArray
}
