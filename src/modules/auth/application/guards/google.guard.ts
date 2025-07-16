import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();

    await super.logIn(request);

    return result;
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    // Uzmi npr. ?accountType=buyer ili bilo koji drugi parametar
    const accountType = req.query.accountType as string | undefined;

    return {
      state: accountType, // prosleđuje se natrag na callback
    };
  }
}
