// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { Logger, ValidationPipe } from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const logger = new Logger('Bootstrap');
//   //app.setGlobalPrefix('api');
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//       transformOptions: {
//         enableImplicitConversion: true,
//       },
//     }),
//   );
//   logger.log(`Application running on port ${process.env.PORT ?? 3001}`);
//   app.enableCors({
//     origin: [
//       'http://localhost:4200',
//       'http://127.0.0.1:4200',
//       'https://clauderp.netlify.app',
//     ],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });
//   const config = new DocumentBuilder()
//     .setTitle('ClaudPOSERP REST FULL API')
//     .setDescription('Endpoints description to ClaudPOSERP')
//     .setVersion('0.1')
//     .addBearerAuth()
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);
//   await app.listen(process.env.PORT ?? 3001);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// 1. Importa este tipo
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // 2. Añade el tipo genérico <NestExpressApplication>
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = new Logger('Bootstrap');

  // 3. ¡IMPORTANTE! Confía en los headers del proxy (X-Forwarded-For)
  // Esto permite que el Throttler obtenga la IP real del cliente
  app.set('trust proxy', 1);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://127.0.0.1:4200',
      'https://clauderp.netlify.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('ClaudPOSERP REST FULL API')
    .setDescription('Endpoints description to ClaudPOSERP')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
bootstrap();
