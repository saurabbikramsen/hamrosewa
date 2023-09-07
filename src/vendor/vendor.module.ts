import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { GoogleMapsModule } from '../googlemaps/googlemaps.module';
import { JwtModule } from '@nestjs/jwt';
import { MinioClientModule } from '../minio-client/minio-client.module';

@Module({
  providers: [VendorService],
  controllers: [VendorController],
  imports: [GoogleMapsModule, JwtModule.register({}), MinioClientModule],
})
export class VendorModule {}
