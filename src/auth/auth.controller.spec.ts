import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { HttpService } from '@nestjs/axios';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      create: jest.fn().mockResolvedValue({ message: 'created' }),
      loginUser: jest.fn().mockResolvedValue({ token: 't' }),
      loginWithGoogle: jest.fn().mockResolvedValue({ token: 'gt' }),
      validateAdminPassword: jest.fn().mockResolvedValue({ valid: true }),
      sendRecoveryEmail: jest.fn().mockResolvedValue({ message: 'sent' }),
      resetPassword: jest.fn().mockResolvedValue({ message: 'reset' }),
      update: jest.fn().mockResolvedValue({ message: 'updated' }),
      findOne: jest.fn().mockResolvedValue({ id: '1' }),
      findAll: jest.fn().mockResolvedValue([]),
      remove: jest.fn().mockResolvedValue({ message: 'deleted' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      // 1. Agregamos PassportModule para evitar el error de "defaultStrategy"
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ThrottlerModule.forRoot([
          {
            ttl: 60,
            limit: 10,
          },
        ]),
      ],
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        // 2. Proveemos el mock de HttpService para el RecaptchaGuard
        {
          provide: HttpService,
          useValue: { post: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call authService.create', async () => {
    const dto = { email: 'a@a.com' } as any;
    const res = await controller.create(dto);
    expect(mockAuthService.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ message: 'created' });
  });

  it('loginUser should call authService.loginUser', async () => {
    const dto = { email: 'a@a.com' } as any;
    const res = await controller.loginUser(dto);
    expect(mockAuthService.loginUser).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ token: 't' });
  });

  it('loginWithGoogle should call authService.loginWithGoogle', async () => {
    const res = await controller.loginWithGoogle('token-123');
    expect(mockAuthService.loginWithGoogle).toHaveBeenCalledWith('token-123');
    expect(res).toEqual({ token: 'gt' });
  });

  it('validateAdminPassword should call authService.validateAdminPassword', async () => {
    const res = await controller.validateAdminPassword('pw');
    expect(mockAuthService.validateAdminPassword).toHaveBeenCalledWith('pw');
    expect(res).toEqual({ valid: true });
  });

  it('recoverPassword should call authService.sendRecoveryEmail', async () => {
    const dto = { email: 'a@a.com' } as any;
    const res = await controller.recoverPassword(dto);
    expect(mockAuthService.sendRecoveryEmail).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ message: 'sent' });
  });

  it('resetPassword should call authService.resetPassword', async () => {
    const dto = { token: 't' } as any;
    const res = await controller.resetPassword(dto);
    expect(mockAuthService.resetPassword).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ message: 'reset' });
  });

  it('update should call authService.update', async () => {
    const user = { id: 'u1' } as any;
    const dto = { name: 'new' } as any;
    const res = await controller.update(user, dto);
    expect(mockAuthService.update).toHaveBeenCalledWith(user, dto);
    expect(res).toEqual({ message: 'updated' });
  });

  it('getUserToUpdate should call authService.findOne', async () => {
    const user = { id: 'u1' } as any;
    const res = await controller.getUserToUpdate(user);
    expect(mockAuthService.findOne).toHaveBeenCalledWith(user.id);
    expect(res).toEqual({ id: '1' });
  });

  it('findAll should call authService.findAll', async () => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await controller.findAll();
    expect(mockAuthService.findAll).toHaveBeenCalled();
    expect(res).toEqual([]);
  });

  it('findOne should call authService.findOne with term', async () => {
    const res = await controller.findOne('term');
    expect(mockAuthService.findOne).toHaveBeenCalledWith('term');
    expect(res).toEqual({ id: '1' });
  });

  it('remove should call authService.remove', async () => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await controller.remove('5');
    expect(mockAuthService.remove).toHaveBeenCalledWith(5);
    expect(res).toEqual({ message: 'deleted' });
  });
});
