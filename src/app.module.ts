import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analyics/analytics.module';
import { UrlModule } from './url/url.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    RateLimiterModule.register({
      points: 10, // 10 requests
      duration: 60, // per minute
    }),
    AuthModule,
    UrlModule,
    AnalyticsModule,
    RedisModule
  ],
})
export class AppModule {}
