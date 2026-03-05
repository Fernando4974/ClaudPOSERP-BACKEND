import { HttpService } from '@nestjs/axios';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { URLSearchParams } from 'url';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { body } = request;
    const tokenR = body.recaptchaToken;
    const secret = process.env.RECAPTCHA_SECRET_KEY_DEV?.trim();

    // 1. Validación básica de entrada
    if (!tokenR) {
      throw new ForbiddenException('reCAPTCHA token is missing');
    }

    if (!secret) {
      console.error('ERROR: RECAPTCHA_SECRET_KEY no está definida en el .env');
      throw new ForbiddenException('Server configuration error');
    }

    // 2. Preparar los parámetros en formato x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', tokenR);

    try {
      // 3. Única llamada oficial a Google por POST
      const { data } = await firstValueFrom(
        this.httpService.post(
          'https://www.google.com/recaptcha/api/siteverify',
          params.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      console.log('--- Respuesta de Google ---');
      console.log(data); // Aquí verás si Google dice success: true
      console.log('---------------------------');

      // 4. Validar el resultado de Google
      if (!data.success) {
        console.error('Detalle del error de Google:', data['error-codes']);
        throw new ForbiddenException('reCAPTCHA validation failed');
      }

      return true; // Si llegamos aquí, el usuario es humano
    } catch (error) {
      // Si el error ya es una ForbiddenException (la de arriba), la lanzamos tal cual
      if (error instanceof ForbiddenException) {
        throw error;
      }

      console.error('Error de conexión con Google API:', error.message);
      throw new ForbiddenException('Error during reCAPTCHA verification');
    }
  }
}
