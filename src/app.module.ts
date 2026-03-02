// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { CommonModule } from './common/common.module';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { ProductsModule } from './products/products.module';
// import { SalesModule } from './sales/sales.module';
// import { SeedModule } from './seed/seed.module';
// import { HttpModule } from '@nestjs/axios';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     HttpModule,
//     MailerModule.forRootAsync({
//       useFactory: () => ({
//         transport: {
//           host: process.env.EMAIL_HOST,
//           port: +process.env.EMAIL_PORT!,
//           secure: false,
//           auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASSWORD,
//           },
//         },
//       }),
//     }),
//     TypeOrmModule.forRoot({
//       ssl: process.env.STAGE === 'prod',
//       type: 'postgres',
//       database: process.env.DB_NAME,
//       host: process.env.DB_HOST!,
//       port: +process.env.DB_PORT! || 6432,
//       username: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       autoLoadEntities: true,
//       synchronize: false,
//       migrationsRun: true,
//     }),
//     AuthModule,
//     CommonModule,
//     ProductsModule,
//     SalesModule,
//     SeedModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
import { resolve } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { SeedModule } from './seed/seed.module';

// Asegúrate de que esta ruta apunte a donde creaste el archivo data-source.ts
import { AppDataSource } from './data-source';

@Module({
  imports: [
    // 1. Variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(__dirname, '../.env'),
    }),

    HttpModule,

    // 2. Configuración de Correo
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          port: +process.env.EMAIL_PORT!,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        },
      }),
    }),

    // 3. Integración de Base de Datos
    // Usamos el spread operator (...) para copiar la config de AppDataSource
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      autoLoadEntities: true, // Mantenlo para que Nest gestione las entidades en memoria
      synchronize: false,
      migrationsRun: true, // OBLIGATORIO: Ya no queremos que Nest cree tablas automáticamente
    }),

    // 4. Tus Módulos
    AuthModule,
    CommonModule,
    ProductsModule,
    SalesModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
