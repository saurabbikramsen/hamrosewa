import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookingsDto {
  @ApiProperty()
  @IsNotEmpty()
  booked_date: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  vendor_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
}
export class AcceptBookingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}
