import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description:
      'Token de recuperación enviado al correo electrónico del usuario',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty({ message: 'El token es obligatorio' })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'La nueva contraseña que el usuario desea establecer',
    example: 'NuevaClave2026!',
    minLength: 6,
    maxLength: 40,
    format: 'password',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(40)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  newPassword: string;
}
