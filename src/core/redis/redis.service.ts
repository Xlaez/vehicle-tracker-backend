import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  insert = async (key: string, value: string): Promise<void> => {
    await this.redis.set(key, value);
  };

  get = async (key: string): Promise<string | null> => {
    return this.redis.get(key);
  };

  remove = async (key: string): Promise<any> => {
    return this.redis.del(key);
  };
}
