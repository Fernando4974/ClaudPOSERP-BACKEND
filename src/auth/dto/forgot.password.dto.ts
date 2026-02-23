import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description:
      'Correo electrónico del usuario que desea recuperar la contraseña',
    example: 'usuario@correo.com',
  })
  @IsEmail({}, { message: 'El formato del correo es inválido' })
  @IsString()
  @IsNotEmpty()
  email: string;
}
