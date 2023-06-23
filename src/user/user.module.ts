import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GoogleMapsModule } from '../googlemaps/googlemaps.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [GoogleMapsModule],
})
export class UserModule {}
