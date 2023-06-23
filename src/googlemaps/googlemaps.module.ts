import { Module } from '@nestjs/common';
import { GoogleMapsService } from './googlemaps.service';

@Module({
  providers: [GoogleMapsService],
  exports: [GoogleMapsService],
})
export class GoogleMapsModule {}
