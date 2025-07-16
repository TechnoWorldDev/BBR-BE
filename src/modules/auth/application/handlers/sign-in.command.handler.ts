import { IAuthRepository } from 'src/modules/auth/domain/auth.repository.interface';
import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { SignInCommand } from '../commands/sign-in.command';

@Injectable()
export class SignInCommandHandler {
  constructor(private readonly authRepository: IAuthRepository) {}

  @LogMethod()
  async handler(command: SignInCommand) {
    const user = await this.authRepository.findByEmail(command.email);

    if (user && !user.password && user.signupMethod === 'google') {
      throw new BadRequestException('Login with Google Account');
    }

    if (!user || !(await bcrypt.compare(command.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
