import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nuevo correo electrónico del usuario',
    example: 'nuevo_email@correo.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Nueva contraseña (solo si desea cambiarla)',
    example: 'NuevaClave2026!',
    minLength: 6,
    maxLength: 40,
    format: 'password',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(40)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password?: string;

  @ApiProperty({
    description: 'Nombre actualizado',
    example: 'Luis',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @MinLength(2)
  name?: string;

  @ApiProperty({
    description: 'Apellido actualizado',
    example: 'Fernández',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  @MinLength(2)
  lastname?: string;

  @ApiProperty({
    description: 'Estado de cuenta del usuario',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Lista de roles asignados',
    example: ['admin', 'user'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @ApiProperty({
    description: 'Fecha de inicio de membresía en formato ISO8601',
    example: '2026-02-23T18:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  membershipStart?: string;

  @ApiProperty({
    description: 'Fecha de fin de membresía en formato ISO8601',
    example: '2027-02-23T18:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  membershipEnd?: string;
}
