import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, RedisOptions } from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisOptions: RedisOptions = {
      username: this.configService.get<string>('REDIS_USER', 'default'),
      host: this.configService.get<string>('REDIS_HOST', '192.168.0.27'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD', 'OIG66^^hfddk0'),
      db: this.configService.get<number>('REDIS_DB', 0),
      retryStrategy: (times: number) => Math.min(times * 50, 2000), // Exponential backoff
    };

    this.client = new Redis(redisOptions);

    this.client.on('connect', () => console.log('✅ Connected to Redis'));
    this.client.on('error', (err) => console.error('❌ Redis Error:', err));
  }

  getClient(): Redis {
    return this.client;
  }

  async setCache(key: string, value: any, ttl: number) {
    await this.client.set(
      `${this.configService.get<string>('REDIS_APP_PREFIX')}-${key}`,
      JSON.stringify(value),
      'EX',
      ttl
    );
  }

  async getCache(key: string) {
    const data = await this.client.get(
      `${this.configService.get<string>('REDIS_APP_PREFIX')}-${key}`
    );
    return data ? JSON.parse(data) : null;
  }

  async delCache(key: string) {
    await this.client.del(`${this.configService.get<string>('REDIS_APP_PREFIX')}-${key}`);
  }
}
