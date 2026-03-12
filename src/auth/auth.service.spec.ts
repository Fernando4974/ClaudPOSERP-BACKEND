import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: any;
  let mockJwtService: any;
  let mockMailerService: any;

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('test-token'),
    };

    mockMailerService = {
      sendMail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and return success message with token', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'Test1234!',
        name: 'John',
        lastname: 'Doe',
      };

      const createdUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createUserDto,
      };

      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);
      mockJwtService.sign.mockReturnValue('test-jwt-token');

      const result = await service.create(createUserDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual({
        message: `User ${createdUser.name} created successfully`,
        token: 'test-jwt-token',
        user: createUserDto.name,
      });
    });
    it('should login a user and return success message with token', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'fernando@gmail.com',
        password: 'pasword123A',
        recaptchaToken: 'token123',
      };
      const mockedUser = {
        id: 'uuid-123',
        email: 'fernando@gmail.com',
        name: 'Fernando',
        password: 'hashed_password', // Representación del hash
        roles: ['Admin'],
      };

      mockUserRepository.findOne.mockResolvedValue(mockedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest
        .spyOn(service as any, 'generateJwtToken')
        .mockReturnValue('test-jwt-token');
      const result = await service.loginUser(loginUserDto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginUserDto.email },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          roles: true,
        },
      });
      expect(result).toEqual({
        message: `User Fernando logged in successfully`,
        token: 'test-jwt-token',
        userRoles: ['Admin'],
      });
    });
  });
});
