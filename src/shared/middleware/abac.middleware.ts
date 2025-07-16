import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from '../cache/redis.service';
import { KnexService } from '../infrastructure/database/knex.service';
import { CustomRequest } from '../types/custom-request';

@Injectable()
export class ABACMiddleware implements NestMiddleware {
  constructor(
    private readonly knexService: KnexService,
    private readonly redisService: RedisService
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const cachedRules = await this.redisService.getCache('abac-rules');
    if (cachedRules) {
      req.abacRules = cachedRules;
      return next();
    }

    // Fetch ABAC rules from DB
    const rules = await this.knexService.connection('abac_rules').select('*');

    req.abacRules = rules;
    await this.redisService.setCache('abac-rules', rules, 3600);

    next();
  }
}
