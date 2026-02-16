import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(40)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password?: string;
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @MinLength(2)
  name: string;
  @IsOptional()
  @IsString()
  @MaxLength(60)
  @MinLength(2)
  lastname?: string;
  @IsOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
  @IsOptional()
  @IsISO8601()
  membershipStart?: string;
  @IsOptional()
  @IsISO8601()
  membershipEnd?: string;
}
