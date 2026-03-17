import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [SalesController],
  providers: [SalesService, CloudinaryService],
  imports: [
    TypeOrmModule.forFeature([Sale, SaleItem]),
    SalesModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [TypeOrmModule],
})
export class SalesModule {}
