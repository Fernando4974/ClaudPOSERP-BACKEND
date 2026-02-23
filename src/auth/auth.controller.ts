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
import { ApiResponse } from '@nestjs/swagger';

@ApiResponse({ status: 201, description: 'User Created', type: User })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  @UseGuards(RecaptchaGuard)
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return this.authService.loginUser(loginUserDto);
  }
  @Post('password-recovery')
  recoverPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.sendRecoveryEmail(forgotPasswordDto);
  }

  @Patch('password-reset')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
  @Auth(validRoles.admin, validRoles.superUser)
  @Patch('update-user')
  update(@GetUser() user: User, @Body() updateAuthDto: UpdateUserDto) {
    return this.authService.update(user, updateAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }
  @Auth(validRoles.superUser, validRoles.admin)
  @Get('user-update')
  getUserToUpdate(@GetUser() user: User) {
    return this.authService.findOne(user.id);
  }
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.authService.findOne(term);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
