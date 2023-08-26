import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookingsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  booked_date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  vendor_id: number;
}
