import { validate } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { plainToClass } from 'class-transformer';

describe('PaginationDtoSpec', () => {
  it('Should be validate whit default values', async () => {
    //Arrage
    const dto = new PaginationDto();
    dto.limit = 10;
    dto.offset = 10;
    //Act
    const error = await validate(dto);
    expect(error.length).toBe(0);
  });
  it('Should be validate whitout default values', async () => {
    //Arrage
    const dto = new PaginationDto();
    //Act
    const error = await validate(dto);
    expect(error.length).toBe(0);
  });
  it('Should can not be validate whit invalid data', async () => {
    const input = { limit: '10', offset: '10' };
    const dto = plainToClass(PaginationDto, input);
    const error = await validate(dto);
    //Assert
    expect(error.length).toBe(0);
  });
});
