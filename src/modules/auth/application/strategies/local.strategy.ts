import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidateUserCommand } from '../commands/validate-user.command';
import { ValidateUserCommandHandler } from '../handlers/validate-user.command.handler';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly validateUserHandler: ValidateUserCommandHandler) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const command = new ValidateUserCommand(email, password);
    const user = await this.validateUserHandler.handler(command);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new ForbiddenException('Email not verified');
    }

    return user;
  }
}
