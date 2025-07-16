import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RedisService } from '../cache/redis.service';
import { KnexService } from '../infrastructure/database/knex.service';
import { CustomRequest } from '../types/custom-request';

@Injectable()
export class RBACMiddleware implements NestMiddleware {
  constructor(
    private readonly knexService: KnexService,
    private readonly redisService: RedisService
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.user || !req.user.role) {
      return next(); // ✅ Allow requests where no role exists (e.g., public routes like login)
    }

    const userId = req.user.id;
    const knex = this.knexService.connection;

    try {
      // Check Redis cache for permissions
      const cachedPermissions = await this.redisService.getCache(`user-permissions:${userId}`);
      if (cachedPermissions) {
        req.user.permissions = cachedPermissions;
        return next();
      }

      // Fetch permissions from DB (optimized query)
      const user = await this.knexService
        .connection('users as u')
        .select(
          knex.raw(`
            json_build_object(
              'id', r.id,
              'name', r.name,
              'description', r.description,
              'permissions', COALESCE(
                json_agg(DISTINCT p.name) 
                FILTER (WHERE p.name IS NOT NULL), '[]'
              )
            ) AS role
          `)
        )
        .leftJoin('roles as r', 'u.role_id', 'r.id')
        .leftJoin('role_permissions as rp', 'r.id', 'rp.role_id')
        .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
        .where('u.id', userId)
        .groupBy('r.id')
        .first();

      if (!user) {
        return next(new UnauthorizedException('Invalid user'));
      }

      // Attach role and permissions to `req.user`
      req.user.role = user.role;
      // req.user.permissions = user.role.permissions || [];

      // Cache user permissions in Redis (1-hour expiration)
      await this.redisService.setCache(`user-permissions:${userId}`, user.permissions, 3600);

      next();
    } catch (error) {
      console.error('RBAC Middleware Error:', error);
      return next(new UnauthorizedException('Access control failed'));
    }
  }
}
