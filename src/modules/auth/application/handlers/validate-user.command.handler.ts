import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IAuthRepository } from 'src/modules/auth/domain/auth.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { ValidateUserCommand } from '../commands/validate-user.command';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';

@Injectable()
export class ValidateUserCommandHandler {
  constructor(private readonly authRepository: IAuthRepository) {}

  @LogMethod()
  async handler(command: ValidateUserCommand) {
    const user = await this.authRepository.findByEmail(command.email);

    if (user && user.status === UserStatusEnum.INACTIVE) {
      throw new UnauthorizedException('Account is inactive');
    }

    if (user && !user.password && user.signupMethod === 'google') {
      throw new BadRequestException('Login with Google Account');
    }

    if (!user || !(await bcrypt.compare(command.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
