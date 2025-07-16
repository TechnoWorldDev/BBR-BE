import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserStatusEnum } from '../types/user-status.enum';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.isAuthenticated || !request.isAuthenticated()) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (
      !request.session.passport ||
      request.session.passport?.user?.status !== UserStatusEnum.ACTIVE
    ) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
