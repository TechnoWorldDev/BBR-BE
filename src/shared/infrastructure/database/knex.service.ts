import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Knex, { Knex as KnexType } from 'knex';
import { Model } from 'objection';
import knexConfig from './../../../../knexfile';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KnexService implements OnModuleInit, OnModuleDestroy {
  private readonly db: KnexType;

  constructor(private readonly configService: ConfigService) {
    this.db = Knex(knexConfig[this.configService.get<string>('NODE_ENV') || 'development']);

    Model.knex(this.db);
  }

  async onModuleInit() {
    console.log('KnexService initialized');
  }

  async onModuleDestroy() {
    await this.db.destroy();
    console.log('KnexService destroyed');
  }

  get connection(): KnexType {
    return this.db;
  }
}
