import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario registrado',
    example: 'admin@pos-system.com',
  })
  @IsEmail({}, { message: 'El formato del correo es inválido' })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Contraseña de acceso del usuario',
    example: 'Abc123!',
    format: 'password',
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;

  @ApiProperty({
    description: 'Token generado por el widget de Google ReCaptcha v2/v3',
    example: '03AFcWeA7... ',
  })
  @IsString()
  @IsNotEmpty({
    message:
      'El token de ReCaptcha es obligatorio para validar que no eres un bot',
  })
  recaptchaToken: string;
}
