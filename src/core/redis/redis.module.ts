import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  providers: [RedisService],
  imports: [
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        enableOfflineQueue: true,
        stringNumbers: true,
      },
    }),
  ],
})
export class RedisConfigModule {}
