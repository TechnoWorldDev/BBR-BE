import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { IAuthRepository } from '../../domain/auth.repository.interface';
import { FindByEmailQuery } from '../commands/find-by-email.query';
import { SignUpGoogleCommandHandler } from '../handlers/sign-up-google.command.handler';
import { FindByEmailQueryHandler } from '../query/find-by-email.command.query';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly findbyEmailQueryHandler: FindByEmailQueryHandler,
    private readonly signUpGoogleCommandHandler: SignUpGoogleCommandHandler,
    private readonly authRepository: IAuthRepository
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    });
  }

  authorizationParams(): Record<string, string> {
    return {
      prompt: 'select_account',
    };
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function
  ) {
    const { email, given_name, family_name, email_verified, picture } = profile._json;

    const query = new FindByEmailQuery(email);

    let user = await this.findbyEmailQueryHandler.handler(query);
    let role;

    const accountType = req.query.state as string;

    if (accountType) {
      role = await this.authRepository.findRoleByName(accountType.toLowerCase().trim());
      if (!role) {
        throw new ForbiddenException('User can not be created');
      }
    }

    if (user) {
      if (user.signupMethod !== profile.provider) {
        throw new ForbiddenException(`Please use ${user.signupMethod} to login`);
      }
    }

    if (!user) {
      user = await this.signUpGoogleCommandHandler.handler({
        email,
        fullName: `${given_name} ${family_name}`,
        signupMethod: profile.provider,
        emailVerified: email_verified,
        roleId: role.id,
      });
      req.session.isNewUser = true;
    } else {
      user = await this.findbyEmailQueryHandler.handler(query);
    }

    return done(null, user);
  }
}
