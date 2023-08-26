import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { GoogleMapsModule } from '../googlemaps/googlemaps.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [VendorService],
  controllers: [VendorController],
  imports: [GoogleMapsModule, JwtModule.register({})],
})
export class VendorModule {}
