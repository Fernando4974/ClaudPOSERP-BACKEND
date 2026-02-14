import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { User } from 'src/auth/entities/user.entity';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
