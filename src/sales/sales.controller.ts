import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Sale } from './entities/sale.entity';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // 1. RUTAS ESTÁTICAS PRIMERO
  // CREAT VENTA ------------------------------------------------->>>
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Sale was created', type: Sale })
  @ApiResponse({ status: 400, description: 'BadRequest' })
  @ApiResponse({
    status: 401,
    description: 'Unahutorized token invalido o inexistente',
  })
  @ApiResponse({
    status: 401,
    description: 'Forbidden Unauthorized by the token',
  })
  @Auth(validRoles.user, validRoles.admin, validRoles.superUser)
  @Post('create')
  @ApiOperation({
    summary: 'Crear venta',
    description:
      'Crer una venta asociada al usuario en cuestion si este autorizado',
  })
  create(@GetUser() user: User, @Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(user, createSaleDto);
  }
  // Obtener todas las VENTAS ------------------------------------------------->>>
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Array whith all sales creates by the user',
    type: Sale,
    example:
      '[{"id":7,"total":"545.00","iva":null,"status":"completed","createdAt":"2026-02-17T19:09:25.622Z"},{"id":8,"total":"601.00","iva":null,"status":"completed","createdAt":"2026-02-17T19:34:25.840Z"},{"id":9,"total":"197.00","iva":null,"status":"completed","createdAt":"2026-02-17T19:56:32.937Z"},{"id":10,"total":"231.00","iva":null,"status":"completed","createdAt":"2026-02-18T02:56:17.377Z"},{"id":11,"total":"231.00","iva":null,"status":"completed","createdAt":"2026-02-18T02:56:25.151Z"},{"id":12,"total":"679.00","iva":null,"status":"completed","createdAt":"2026-02-18T02:58:26.625Z"},{"id":15,"total":"906.99","iva":null,"status":"completed","createdAt":"2026-02-18T05:22:48.132Z"},{"id":16,"total":"906.99","iva":null,"status":"completed","createdAt":"2026-02-18T05:22:55.785Z"},{"id":17,"total":"906.99","iva":null,"status":"completed","createdAt":"2026-02-18T05:22:59.140Z"},{"id":18,"total":"906.99","iva":null,"status":"completed","createdAt":"2026-02-18T05:22:59.435Z"},{"id":19,"total":"906.99","iva":null,"status":"completed","createdAt":"2026-02-18T05:22:59.439Z"},{"id":20,"total":"906.99","iva":null,"status":"completed","createdAt":"2026-02-18T05:23:02.163Z"},{"id":21,"total":"906.99","iva":null,"status":"completed","createdAt":"2026-02-18T05:23:10.062Z"},{"id":22,"total":"906.99","iva":null,"status":"completed","createdAt":"2026-02-18T05:23:10.067Z"},{"id":23,"total":"906.99","iva":null,"status":"completed","createdAt":"2026-02-18T05:23:12.216Z"},{"id":24,"total":"906.99","iva":null,"status":"completed","createdAt":"2026-02-18T05:23:30.705Z"},{"id":25,"total":"250.00","iva":null,"status":"completed","createdAt":"2026-02-18T05:24:38.691Z"},{"id":27,"total":"261.99","iva":"28.00","status":"completed","createdAt":"2026-02-18T19:31:13.975Z"},{"id":29,"total":"206.00","iva":"22.00","status":"completed","createdAt":"2026-02-18T20:48:46.567Z"},{"id":30,"total":"401.99","iva":"43.00","status":"completed","createdAt":"2026-02-19T17:14:53.727Z"},{"id":31,"total":"405.00","iva":"43.00","status":"completed","createdAt":"2026-02-19T20:09:29.373Z"},{"id":34,"total":"1482.00","iva":"159.00","status":"completed","createdAt":"2026-02-20T16:58:15.595Z"},{"id":35,"total":"420.99","iva":"45.00","status":"completed","createdAt":"2026-02-20T17:36:31.884Z"},{"id":36,"total":"154.97","iva":"17.00","status":"completed","createdAt":"2026-02-20T20:08:33.691Z"},{"id":37,"total":"339.99","iva":"36.00","status":"completed","createdAt":"2026-02-20T20:09:53.516Z"},{"id":38,"total":"468.00","iva":"50.00","status":"completed","createdAt":"2026-02-20T20:10:29.266Z"},{"id":39,"total":"318.00","iva":"34.00","status":"completed","createdAt":"2026-02-20T20:10:36.353Z"},{"id":40,"total":"529.00","iva":"57.00","status":"completed","createdAt":"2026-02-20T20:10:49.526Z"},{"id":41,"total":"265.00","iva":"28.00","status":"completed","createdAt":"2026-02-20T20:11:27.504Z"},{"id":42,"total":"314.00","iva":"34.00","status":"completed","createdAt":"2026-02-20T20:11:34.556Z"},{"id":43,"total":"381.00","iva":"41.00","status":"completed","createdAt":"2026-02-20T20:12:23.251Z"},{"id":44,"total":"188.00","iva":"20.00","status":"completed","createdAt":"2026-02-20T20:13:16.000Z"},{"id":45,"total":"251.00","iva":"27.00","status":"completed","createdAt":"2026-02-20T20:13:41.915Z"},{"id":46,"total":"251.00","iva":"27.00","status":"completed","createdAt":"2026-02-20T20:13:42.359Z"},{"id":47,"total":"215.00","iva":"23.00","status":"completed","createdAt":"2026-02-20T20:14:21.397Z"},{"id":48,"total":"430.00","iva":"46.00","status":"completed","createdAt":"2026-02-20T20:15:24.231Z"},{"id":49,"total":"198.98","iva":"21.00","status":"completed","createdAt":"2026-02-20T20:15:59.188Z"},{"id":50,"total":"540.00","iva":"58.00","status":"completed","createdAt":"2026-02-20T20:17:04.945Z"},{"id":51,"total":"540.00","iva":"58.00","status":"completed","createdAt":"2026-02-20T20:17:13.353Z"},{"id":52,"total":"273.00","iva":"29.00","status":"completed","createdAt":"2026-02-20T20:21:15.705Z"},{"id":53,"total":"421.00","iva":"45.00","status":"completed","createdAt":"2026-02-20T20:22:18.509Z"},{"id":54,"total":"193.00","iva":"21.00","status":"completed","createdAt":"2026-02-20T20:23:15.807Z"},{"id":55,"total":"193.00","iva":"21.00","status":"completed","createdAt":"2026-02-20T20:23:26.977Z"},{"id":56,"total":"711.00","iva":"76.00","status":"completed","createdAt":"2026-02-20T20:24:21.242Z"},{"id":57,"total":"507.00","iva":"54.00","status":"completed","createdAt":"2026-02-20T20:27:48.342Z"},{"id":58,"total":"346.99","iva":"37.00","status":"completed","createdAt":"2026-02-20T20:28:17.885Z"},{"id":59,"total":"421.00","iva":"45.00","status":"completed","createdAt":"2026-02-20T20:28:30.192Z"},{"id":60,"total":"162.00","iva":"17.00","status":"completed","createdAt":"2026-02-20T20:30:22.503Z"},{"id":61,"total":"653.00","iva":"70.00","status":"completed","createdAt":"2026-02-20T20:30:51.491Z"},{"id":62,"total":"270.00","iva":"29.00","status":"completed","createdAt":"2026-02-20T20:30:59.181Z"},{"id":63,"total":"171.00","iva":"18.00","status":"completed","createdAt":"2026-02-21T06:19:54.702Z"},{"id":64,"total":"298.00","iva":"32.00","status":"completed","createdAt":"2026-02-21T06:24:42.906Z"},{"id":65,"total":"724.00","iva":"78.00","status":"completed","createdAt":"2026-02-21T06:26:08.540Z"},{"id":66,"total":"96.00","iva":"10.00","status":"completed","createdAt":"2026-02-21T06:26:45.760Z"},{"id":67,"total":"427.00","iva":"46.00","status":"completed","createdAt":"2026-02-21T06:32:47.267Z"},{"id":68,"total":"129.00","iva":"14.00","status":"completed","createdAt":"2026-02-22T02:59:50.590Z"},{"id":69,"total":"355.00","iva":"38.00","status":"completed","createdAt":"2026-02-22T03:00:45.054Z"},{"id":70,"total":"208.00","iva":"22.00","status":"completed","createdAt":"2026-02-22T03:50:06.657Z"},{"id":71,"total":"421.00","iva":"45.00","status":"completed","createdAt":"2026-02-22T03:51:24.173Z"},{"id":72,"total":"57.00","iva":"0.00","status":"completed","createdAt":"2026-02-24T00:00:17.152Z"},{"id":73,"total":"184.00","iva":"0.00","status":"completed","createdAt":"2026-02-24T00:00:44.084Z"},{"id":74,"total":"184.00","iva":"0.00","status":"POR COBRAR","createdAt":"2026-02-24T00:13:37.282Z"},{"id":75,"total":"47.00","iva":"0.00","status":"CHEQUE","createdAt":"2026-02-24T00:13:51.720Z"},{"id":76,"total":"22.00","iva":"0.00","status":"EFECTIVO","createdAt":"2026-02-24T01:57:12.294Z"},{"id":77,"total":"165.00","iva":"0.00","status":"EFECTIVO","createdAt":"2026-02-24T01:57:20.598Z"},{"id":78,"total":"2306.99","iva":"247.00","status":"POR COBRAR","createdAt":"2026-02-24T02:03:05.366Z"}]',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized Token invalido o inexisente',
  })
  @Auth(validRoles.admin, validRoles.user, validRoles.superUser)
  @Get('get-all')
  @ApiOperation({
    summary: 'Obtener Ventas',
    description: 'Obtener todas las ventas asociadas al usuario',
  })
  findAll(@GetUser() user: User, @Query() paginationDto?: PaginationDto) {
    return this.salesService.findAll(user, paginationDto);
  }
  // OBTENER VENTAS DEL DIA ------------------------------------------------->>>
  @Auth(validRoles.admin, validRoles.user, validRoles.superUser)
  @Get('sales-day')
  salesDay(@GetUser() user: User) {
    return this.salesService.salesDay(user);
  }
  // 2. RUTAS DINÁMICAS AL FINAL
  // OBTENER UNA SOLA VENTA POR ID ------------------------------------------------->>>
  @ApiResponse({
    status: 200,
    type: Sale,
    example:
      '{"id":1,"total":"1530.99","iva":null,"status":"completed","createdAt":"2026-02-17T17:28:58.994Z","user":{"id":"c75a1324-b26d-4a65-975e-6c5c389e8aca","email":"mievolucion98@gmail.com","password":"$2b$10$0G8e8k.AoDeZg/ErsZdsJuzpfPfpkzMqZ1M28BLGS//jhhNKVwPDa","name":"andres","lastname":"Villarreal","roles":["user"],"isActive":true,"membershipStart":null,"membershipEnd":null},"items":[]}',
  })
  @ApiResponse({
    status: 404,
    description: 'Sale not found',
    example: { message: 'Sale not found', error: 'Not Found', statusCode: 404 },
  })
  @Get(':id')
  @ApiParam({ name: 'id', example: '1' })
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }
  // ACTUALIZAR UNA SOLA VENTA POR ID  NO IMPLEMENTADA------------------------------------------>>>
  @ApiExcludeEndpoint()
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 201 })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }
  // ELIMINAR UNA SOLA VENTA POR ID ------------------------------------------>>>
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: '10' })
  @ApiResponse({
    status: 401,
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
    description: 'Token invalido o inexistente',
  })
  @ApiResponse({
    status: 401,
    example: { message: 'Sale not found', error: 'Not Found', statusCode: 404 },
    description: 'Venta no encontrada',
  })
  @ApiResponse({
    status: 200,
    example: {
      message: 'Sale #9 has been deleted successfully',
      deletedId: '9',
    },
    description: 'Venta Eliminada',
  })
  @Auth(validRoles.admin, validRoles.superUser)
  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
