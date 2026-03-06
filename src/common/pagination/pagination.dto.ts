import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Número de elementos a mostrar por página',
    example: 10,
  })
  @Type(() => Number)
  @IsOptional()
  limit?: number;
  @ApiProperty({
    description: 'Desplazamiento de elementos',
    example: 0,
  })
  @Type(() => Number)
  @IsOptional()
  offset?: number;
}
