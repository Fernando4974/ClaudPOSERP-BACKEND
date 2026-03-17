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
import {
  Throttle,
  ThrottlerGuard,
  SkipThrottle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ThrottlerModule,
} from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ==========================================
  // 1. REGISTRO DE USUARIOS
  // ==========================================
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
    // Crea un usuario nuevo en la base de datos (público)
    return this.authService.create(createUserDto);
  }

  // ==========================================
  // 2. LOGIN TRADICIONAL (CON RECAPTCHA)
  // ==========================================
  @Post('login')
  @UseGuards(RecaptchaGuard, ThrottlerGuard)
  @SkipThrottle() // El Recaptcha ya hace el trabajo de frenar bots aquí
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Requiere validación de Google Recaptcha v2/v3',
  })
  @ApiResponse({ status: 200, description: 'Login exitoso, devuelve JWT' })
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    // Valida credenciales y retorna el Token de acceso
    return this.authService.loginUser(loginUserDto);
  }

  // ==========================================
  // 3. LOGIN CON GOOGLE
  // ==========================================
  @Post('google-login')
  @ApiOperation({ summary: 'Iniciar sesión con Google' })
  @ApiResponse({ status: 200, description: 'Login exitoso con Google' })
  loginWithGoogle(@Body('token') token: string) {
    // Valida el token enviado por el frontend desde el SDK de Google
    return this.authService.loginWithGoogle(token);
  }

  // ==========================================
  // 4. SEGURIDAD ADMIN (VALIDACIÓN EXTRA)
  // ==========================================
  @Post('validate-admin-password')
  @ApiOperation({
    summary: 'Validar contraseña de administrador',
    description: 'Verificación secundaria para acciones sensibles de un admin',
  })
  validateAdminPassword(@Body('password') password: string) {
    // Comprueba si la clave es correcta sin cerrar sesión ni generar nuevos tokens
    return this.authService.validateAdminPassword(password);
  }

  // ==========================================
  // 5. RECUPERACIÓN DE CONTRASEÑA
  // ==========================================
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 2, ttl: 60000 } }) // Máximo 2 intentos cada 10 seg (Anti-spam)
  @Post('recover-password') // Nota: Asegúrate que la ruta coincida con tu servicio
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  recoverPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    // Genera un token temporal y envía el correo al usuario
    return this.authService.sendRecoveryEmail(forgotPasswordDto);
  }

  @Patch('password-reset')
  @ApiOperation({ summary: 'Restablecer contraseña usando un token' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // Cambia la contraseña vieja por la nueva usando el token del correo
    return this.authService.resetPassword(resetPasswordDto);
  }

  // ==========================================
  // 6. GESTIÓN DE PERFIL (PROTEGIDO)
  // ==========================================
  @Patch('update-user')
  @Auth(validRoles.admin, validRoles.superUser) // Solo Admins o SuperUsers
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar perfil de usuario autenticado' })
  update(@GetUser() user: User, @Body() updateAuthDto: UpdateUserDto) {
    // Actualiza los datos del usuario que tiene la sesión activa
    return this.authService.update(user, updateAuthDto);
  }

  @Get('user-update')
  @Auth(validRoles.superUser, validRoles.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener datos del usuario actual para edición' })
  getUserToUpdate(@GetUser() user: User) {
    // Obtiene la info del usuario logueado para precargar formularios de edición
    return this.authService.findOne(user.id);
  }

  // ==========================================
  // 7. ADMINISTRACIÓN DE USUARIOS (BÚSQUEDA Y BORRADO)
  // ==========================================
  @Get()
  @ApiOperation({
    summary: 'Listar todos los usuarios (Solo desarrollo/admin)',
  })
  findAll() {
    // Retorna la lista completa de usuarios
    return this.authService.findAll();
  }

  @Get(':term')
  @ApiOperation({ summary: 'Buscar usuario por ID, email o nombre' })
  findOne(@Param('term') term: string) {
    // Busca un usuario específico mediante un término (ID o Email)
    return this.authService.findOne(term);
  }

  @Delete(':id')
  @Auth(validRoles.superUser) // Solo el rango más alto puede eliminar
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un usuario por ID (Solo SuperUser)' })
  remove(@Param('id') id: string) {
    // Elimina físicamente o deshabilita a un usuario por su ID
    return this.authService.remove(+id);
  }
}
