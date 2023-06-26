import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BookingsDto {
  @IsDate()
  @IsNotEmpty()
  booked_date: Date;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  vendor_id: number;
}
