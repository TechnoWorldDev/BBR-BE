import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ABAC_KEY } from '../decorators/abac.decorator';

@Injectable()
export class ABACGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user, abacRules } = request;

    if (!user) throw new ForbiddenException('User not authenticated');

    const abacCondition = this.reflector.get<(user: any, req: any) => boolean>(
      ABAC_KEY,
      context.getHandler()
    );
    if (abacCondition && !abacCondition(user, request)) {
      throw new ForbiddenException('ABAC policy denied access');
    }

    return true;
  }
}
