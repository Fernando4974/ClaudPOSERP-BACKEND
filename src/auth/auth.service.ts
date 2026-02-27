import {
  ConflictException,
  HttpCode,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ArrayContains, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginResponse } from './interfaces/login-response.interfaces';
import { isUUID } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
  // Create a new user
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return {
        message: `User ${user.name} created successfully`,
        token: this.generateJwtToken({ id: user.id }),
        user: createUserDto.name,
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }
  // Generate JWT token for a user
  private generateJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }
  // User login
  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new UnauthorizedException({ error: 'User not found' });
    }
    const passwordRegular = loginUserDto.password;
    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        passwordBd: user.password,
        error: 'SERVER: Invalid password',
        message: passwordRegular,
      });
    }
    return {
      message: `User ${user.name} logged in successfully`,
      token: this.generateJwtToken({ id: user.id }),
      userRoles: user.roles,
    };
  }
  //valide admin password
  async validateAdminPassword(password: string): Promise<boolean> {
    const admins = await this.userRepository.find({
      where: { roles: ArrayContains(['admin']) },
      select: ['password'],
    });

    for (const admin of admins) {
      const isMatch = await bcrypt.compare(password, admin.password);

      if (isMatch) {
        return true;
        //return admin; // to view the admin data if needed
      }
    }
    return false;
  }

  // Send recovery email
  @HttpCode(201)
  async sendRecoveryEmail(forgotPasswordDto: ForgotPasswordDto) {
    console.log('sendEmailFunctionON');
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });
    if (!user) {
      throw new UnauthorizedException({ error: 'User not found' });
    }
    const token = this.generateJwtToken({ id: user.id });
    const recoveryUrl =
      process.env.UrlForResetPassword + token + '&email=' + user.email;
    console.log(recoveryUrl);
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Password Recovery',
        text: `Hello ${user.name}, click the link to reset your password. ${recoveryUrl}`,
        context: {
          token: token,
          url: recoveryUrl,
        },
      });
      return { message: 'Recovery email sent' };
    } catch (error) {
      throw new InternalServerErrorException({
        error: 'Failed to send email Error: ' + error.message,
      });
    }
  }
  //reset password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException({ error: 'Invalid or expired token' });
    }
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });
    if (!user) {
      throw new UnauthorizedException({ error: 'User not found' });
    }
    if (!user.isActive) {
      throw new UnauthorizedException({ error: 'User is inactive' });
    }
    if (await bcrypt.compare(newPassword, user.password)) {
      throw new UnauthorizedException({
        error: 'New password must be different from the old password',
      });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    try {
      await this.userRepository.save(user);
      console.log(user.password);
      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new InternalServerErrorException({
        error: 'Failed to reset password Error: ' + error.message,
      });
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  async findOne(term: string) {
    let user: User | null = null;

    if (isUUID(term)) {
      // findOne permite usar 'select' para filtrar campos
      user = await this.userRepository.findOne({
        where: { id: term },
        select: [
          'id',
          'email',
          'name',
          'lastname',
          'isActive',
          'roles',
          'membershipStart',
          'membershipEnd',
        ], // No incluyas 'password'
      });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      user = await queryBuilder
        .select([
          'user.id',
          'user.email',
          'user.name',
          'user.lastname',
          'user.isActive',
          'user.roles',
          'user.membershipStart',
          'user.membershipEnd',
        ])
        .where('user.email = :email or LOWER(user.name) = :name', {
          email: term.toLowerCase(),
          name: term.toLowerCase(),
        })
        .getOne();
    }

    if (!user) throw new NotFoundException(`Usuario no encontrado`);
    console.log(user);
    return user;
  }

  async update(user: User, updateAuthDto: UpdateUserDto) {
    const userExist = await this.userRepository.findOneBy({ id: user.id });
    if (!userExist) {
      return 'User not found';
    }

    if (updateAuthDto.password) {
      updateAuthDto.password = await bcrypt.hash(updateAuthDto.password, 10);
    }

    const userToUpdate = await this.userRepository.preload({
      id: userExist.id,
      ...updateAuthDto,
    });
    if (!userToUpdate) {
      return new NotFoundException('User not found');
    }
    try {
      await this.userRepository.save(userToUpdate);
      return userToUpdate;
    } catch (error) {
      return this.handleDBErrors(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  private handleDBErrors(error: any): never {
    // Implement your database error handling logic here
    if (error.code === '23505') {
      throw new ConflictException('User is already exist ');
    }

    throw new InternalServerErrorException(
      'Database error occurred' + error.message,
    );
  }
}
