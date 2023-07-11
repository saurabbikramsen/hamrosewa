import { IsNotEmpty, IsString } from 'class-validator';

export class ServicesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
