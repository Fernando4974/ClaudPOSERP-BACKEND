import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRoles } from 'src/auth/interfaces/valid-roles';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Auth(validRoles.admin, validRoles.superUser)
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.create(createProductDto, user, file);
  }
  @Get('getAll')
  findAll() {
    return this.productsService.findAll();
  }
  @Get('number-key/:data')
  findNumberKey(@Param('data', ParseIntPipe) data: string) {
    const numericValue = parseInt(data, 10);
    console.log(numericValue);
    if (isNaN(numericValue)) {
      throw new BadRequestException('El valor de data debe ser un número');
    }

    return this.productsService.findNumberKey(numericValue);
  }
  @Auth(validRoles.admin, validRoles.superUser)
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('file from controller', file);
    console.log('product from controller back', file);
    return this.productsService.update(id, user, updateProductDto, file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
  @Auth(validRoles.admin, validRoles.superUser)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
