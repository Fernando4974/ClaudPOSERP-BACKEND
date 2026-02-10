import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SalesService {
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

  findAll() {
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
  private handleDBErrors(error: any): never {
    // Implement your database error handling logic here
    if (error.code === '23505') {
      console.log(error);
      throw new ConflictException(
        'Product is already exist or keyName is already asigned',
      );
    }

    throw new InternalServerErrorException(
      'Database error occurred' + error.message,
    );
  }
}
