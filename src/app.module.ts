import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analyics/analytics.module';
import { UrlModule } from './url/url.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    RateLimiterModule.register({
      points: 10,
      duration: 60,
      execEvenly: false, // Ensure instant blocking after limit is reached
  keyPrefix: 'rate_limit',
    }),
    AuthModule,
    UrlModule,
    AnalyticsModule,
    RedisModule,
    CacheModule.register({ isGlobal: true })
  ],
})
export class AppModule {}
