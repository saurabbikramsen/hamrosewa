import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { GoogleMapsModule } from '../googlemaps/googlemaps.module';

@Module({
  providers: [VendorService],
  controllers: [VendorController],
  imports: [GoogleMapsModule],
})
export class VendorModule {}
