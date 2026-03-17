import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Patch,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { validRoles } from '../auth/interfaces/valid-roles';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../common/pagination/pagination.dto';
@ApiTags('Products') // Agrupa en Swagger
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @Auth(validRoles.admin, validRoles.superUser)
  @ApiBearerAuth() // Activa el candado en Swagger
  @ApiConsumes('multipart/form-data') // Necesario para subir archivos
  @ApiOperation({
    summary: 'Crear un nuevo producto',
    description: 'Requiere rol de Admin o SuperUser',
  })
  @ApiResponse({ status: 201, description: 'Producto creado correctamente' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado (Token inválido o ausente)',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido (No tienes los roles necesarios)',
  })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.create(createProductDto, user, file);
  }

  @Get('getAll')
  @Auth(validRoles.user, validRoles.superUser, validRoles.admin)
  @ApiOperation({ summary: 'Listar todos los productos' })
  @ApiResponse({ status: 200, description: 'Retorna un arreglo de productos' })
  findAll(@GetUser() user: User, @Query() paginationDto?: PaginationDto) {
    return this.productsService.findAll(user, paginationDto);
  }

  @Get('number-key/:data')
  @ApiOperation({ summary: 'Buscar producto por tecla rápida (POS)' })
  findNumberKey(@Param('data', ParseIntPipe) data: string) {
    const numericValue = parseInt(data, 10);
    return this.productsService.findNumberKey(numericValue);
  }

  @Patch('update/:id')
  @Auth(validRoles.admin, validRoles.superUser)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualizar un producto existente' })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @ApiResponse({ status: 401, description: 'Sin token' })
  @ApiResponse({ status: 403, description: 'Roles insuficientes' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.update(id, user, updateProductDto, file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Delete(':id')
  @Auth(validRoles.admin, validRoles.superUser)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  @ApiResponse({ status: 400, description: 'ID no es un UUID válido' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
