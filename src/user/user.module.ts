import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GoogleMapsModule } from '../googlemaps/googlemaps.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [GoogleMapsModule, JwtModule.register({})],
})
export class UserModule {}
