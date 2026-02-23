import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SalesService {
  private readonly logger = new Logger('SalesService');
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
  ) {}
  async create(user: User, createSaleDto: CreateSaleDto) {
    try {
      const sale = this.saleRepository.create({
        ...createSaleDto,
        user: user,
      });

      return await this.saleRepository.save(sale);
    } catch (error) {
      return this.handleDBErrors(error);
    }
  }

  findAll(user: User) {
    const sales = this.saleRepository.find({
      where: { user: { id: user.id } },
    });
    return sales;
  }
  async findOne(id: string) {
    // Validación preventiva: Si el ID es "create", algo salió mal en el ruteo
    if (id === 'create') {
      throw new BadRequestException('ID de venta inválido');
    }

    const sale = await this.saleRepository.findOne({
      where: { id: id as any }, // 'as any' para compatibilidad según tu entidad (UUID o Int)
      relations: ['items', 'user'],
    });

    if (!sale) throw new NotFoundException('Sale not found');

    return sale;
  }

  // async findOne(id: string) {
  //   const sale = await this.saleRepository.findOne({
  //     where: { id },
  //     relations: ['items', 'user'],
  //   });
  //   if (sale) {
  //     return sale;
  //   } else {
  //     return this.handleDBErrors('Sale not found');
  //   }
  // }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  async remove(id: string) {
    const saleTodelete = await this.saleRepository.findOne({ where: { id } });
    if (!saleTodelete) {
      return this.handleDBErrors('Sale not found');
    }
    try {
      // 3. Intentamos borrar
      await this.saleRepository.remove(saleTodelete);
      return {
        message: `Sale #${id} has been deleted successfully`,
        deletedId: id,
      };
    } catch (error) {
      // 4. Capturamos errores de base de datos (ej: restricción de integridad)
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any): never {
    // 1. Logueamos el error completo para debug en desarrollo
    this.logger.error(error);

    // 2. Errores específicos de Postgres (códigos de 5 caracteres)
    switch (error.code) {
      case '23505': // unique_violation
        throw new ConflictException({
          code: 'DUPLICATE_RECORD',
          message: 'El registro ya existe (llave duplicada).',
          detail: error.detail,
        });

      case '23503': // foreign_key_violation
        throw new BadRequestException({
          code: 'FOREIGN_KEY_ERROR',
          message:
            'No se puede realizar la operación: existe una restricción de relación.',
          detail: error.detail,
        });

      case '23502': // not_null_violation
        throw new BadRequestException({
          code: 'MISSING_FIELD',
          message: 'Un campo obligatorio está vacío.',
          column: error.column,
        });

      case '22P02': // invalid_text_representation (ej: UUID mal formado)
        throw new BadRequestException({
          code: 'INVALID_FORMAT',
          message:
            'El formato de los datos es inválido (UUID o tipo de dato incorrecto).',
        });

      case '22001': // string_data_right_truncation
        throw new BadRequestException({
          code: 'STRING_TOO_LONG',
          message:
            'El texto ingresado excede el límite de caracteres permitido.',
        });

      case '42703': // undefined_column
        throw new InternalServerErrorException({
          code: 'DB_SCHEMA_ERROR',
          message:
            'Error de esquema: se intentó acceder a una columna que no existe.',
        });
    }

    // 3. Manejo de errores personalizados que pasamos como string
    if (error === 'Sale not found' || error === 'Product not found') {
      throw new NotFoundException(error);
    }

    // 4. Error genérico por defecto
    throw new InternalServerErrorException(
      `Unexpected database error: ${error.message || 'Check logs'}`,
    );
  }
}
