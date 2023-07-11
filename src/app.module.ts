import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { VendorModule } from './vendor/vendor.module';
import { BookingsModule } from './bookings/bookings.module';
import { JwtModule } from '@nestjs/jwt';
import { ServicesModule } from './services/services.module';
import { MinioClientModule } from './minio-client/minio-client.module';

@Global()
@Module({
  imports: [
    PrismaModule,
    UserModule,
    JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VendorModule,
    BookingsModule,
    MinioClientModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [JwtModule],
})
export class AppModule {}
