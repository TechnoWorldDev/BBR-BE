import { Injectable } from '@nestjs/common';
import { RedisService } from '../cache/redis.service';
import { Redis } from 'ioredis';

@Injectable()
export class PubSubService {
  private pub: Redis;
  private sub: Redis;

  constructor(private readonly redisService: RedisService) {
    this.pub = this.redisService.getClient();
    this.sub = this.redisService.getClient().duplicate();

    this.sub.subscribe('invalidate-cache', (err) => {
      if (err) console.error('❌ Failed to subscribe to cache invalidation:', err);
    });

    this.sub.on('message', async (channel, key) => {
      if (channel === 'invalidate-cache') {
        console.log(`🔥 Clearing cache for: ${key}`);
        await this.redisService.delCache(key);
      }
    });
  }

  async invalidateCache(key: string) {
    await this.pub.publish('invalidate-cache', key);
  }
}
