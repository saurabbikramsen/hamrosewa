import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { VendorModule } from './vendor/vendor.module';
import { BookingsModule } from './bookings/bookings.module';
import { JwtModule } from '@nestjs/jwt';
import { ServicesModule } from './services/services.module';
import { MinioClientModule } from './minio-client/minio-client.module';
import { AdminModule } from './admin/admin.module';
import { AdminVerificationMiddleware } from './middlewares/admin_verification_middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { CollaborativeFilteringService } from './collaborative-filtering/collaborative-filtering.service';
import { RecommendationModule } from './recommendation/recommendation.module';
import { PaymentModule } from './payment/payment.module';

@Global()
@Module({
  imports: [
    PrismaModule,
    UserModule,
    JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),
    VendorModule,
    BookingsModule,
    MinioClientModule,
    ServicesModule,
    AdminModule,
    RecommendationModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    CollaborativeFilteringService,
  ],
  exports: [JwtModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AdminVerificationMiddleware).forRoutes('user/caste');
  }
}
