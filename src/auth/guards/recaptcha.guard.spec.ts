import { Test, TestingModule } from '@nestjs/testing';
import { RecaptchaGuard } from './recaptcha.guard';
import { HttpService } from '@nestjs/axios';

describe('RecaptchaGuard', () => {
  let guard: RecaptchaGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecaptchaGuard,
        {
          provide: HttpService,
          useValue: { post: jest.fn() }, // Creamos un mock simple del HttpService
        },
      ],
    }).compile();

    guard = module.get<RecaptchaGuard>(RecaptchaGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
