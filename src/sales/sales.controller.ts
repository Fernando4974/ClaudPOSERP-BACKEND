import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}
  @Auth(validRoles.user, validRoles.admin, validRoles.superUser)
  @Post('create')
  create(@GetUser() user: User, @Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(user, createSaleDto);
  }

  @Auth(validRoles.admin, validRoles.user, validRoles.superUser)
  @Get('get-all')
  findAll(@GetUser() user: User) {
    return this.salesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Auth(validRoles.admin, validRoles.superUser)
  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
