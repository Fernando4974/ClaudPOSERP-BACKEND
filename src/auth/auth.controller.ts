import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { LoginResponse } from './interfaces/login-response.interfaces';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth } from './decorators/auth.decorator';
import { validRoles } from './interfaces/valid-roles';
import { RecaptchaGuard } from './guards/recaptcha.guard';

@ApiTags('Auth') // Agrupa todos los endpoints de autenticación
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o correo duplicado',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @UseGuards(RecaptchaGuard)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Requiere validación de Google Recaptcha v2/v3',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, devuelve JWT y datos del usuario',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas o token de Recaptcha fallido',
  })
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('password-recovery')
  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña',
    description: 'Envía un correo con el token de recuperación',
  })
  @ApiResponse({
    status: 200,
    description: 'Si el correo existe, se enviarán instrucciones',
  })
  recoverPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.sendRecoveryEmail(forgotPasswordDto);
  }

  @Patch('password-reset')
  @ApiOperation({ summary: 'Restablecer contraseña usando un token' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada con éxito' })
  @ApiResponse({
    status: 400,
    description: 'Token inválido o contraseña débil',
  })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Patch('update-user')
  @Auth(validRoles.admin, validRoles.superUser)
  @ApiBearerAuth() // 👈 Muestra el candado en Swagger
  @ApiOperation({ summary: 'Actualizar perfil de usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
  })
  @ApiResponse({ status: 403, description: 'No tiene permisos suficientes' })
  update(@GetUser() user: User, @Body() updateAuthDto: UpdateUserDto) {
    return this.authService.update(user, updateAuthDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos los usuarios (Solo desarrollo/admin)',
  })
  findAll() {
    return this.authService.findAll();
  }

  @Get('user-update')
  @Auth(validRoles.superUser, validRoles.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener datos del usuario actual para edición' })
  getUserToUpdate(@GetUser() user: User) {
    return this.authService.findOne(user.id);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Buscar usuario por ID, email o nombre' })
  findOne(@Param('term') term: string) {
    return this.authService.findOne(term);
  }

  @Delete(':id')
  @Auth(validRoles.superUser)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un usuario por ID (Solo SuperUser)' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
