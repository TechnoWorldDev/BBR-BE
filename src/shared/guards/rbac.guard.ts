import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());

    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role.permissions) return false;

    const userPermissions = new Set(user.role.permissions ?? []);
    const hasPermission = requiredPermissions.some((perm) => userPermissions.has(perm));

    if (!hasPermission) throw new ForbiddenException('You do not have permission for this action.');

    return true;
  }
}
