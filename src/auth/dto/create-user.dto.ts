import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Correo electrónico institucional o personal',
    example: 'usuario@correo.com',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Contraseña de acceso. Debe ser robusta.',
    example: 'Abc123!',
    minLength: 6,
    maxLength: 40,
    format: 'password', // Esto oculta los caracteres en la UI de Swagger
  })
  @IsString()
  @MinLength(6)
  @MaxLength(40)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;

  @ApiProperty({
    description: 'Primer nombre del usuario',
    example: 'Andrés',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Apellidos completos del usuario',
    example: 'Pérez García',
    minLength: 2,
    maxLength: 60,
  })
  @IsString()
  @MaxLength(60)
  @MinLength(2)
  lastname: string;
}
