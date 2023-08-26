import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { StateEnum } from '../../Enums/enum';

export class VendorDto {
  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  service_type: string;

  @ApiProperty()
  @IsEnum(StateEnum)
  @IsNotEmpty()
  state: StateEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postal_code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  lng: number;

  // locationId;
}

export class VendorLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
