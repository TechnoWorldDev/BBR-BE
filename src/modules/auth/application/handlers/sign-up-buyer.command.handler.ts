import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { IAuthRepository } from 'src/modules/auth/domain/auth.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';
import { SignupMethodEnum } from 'src/shared/types/signup-method.enum';
import { SignUpBuyerCommand } from '../commands/sign-up-buyer.command';
import { SendVerifyEmailCommandHandler } from 'src/modules/user/application/handler/send-verify-email.command.handler';
import { SendVerificationCommand } from 'src/modules/user/application/command/send-verification.command';
import { User } from 'src/modules/user/domain/user.entity';

@Injectable()
export class SignUpBuyerCommandHandler {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly sendVerifyEmailCommandHandler: SendVerifyEmailCommandHandler
  ) {}

  @LogMethod()
  async handler(command: SignUpBuyerCommand): Promise<User> {
    const existingUser = await this.authRepository.findByEmail(command.email!);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const role = await this.authRepository.findRoleByName('Buyer');
    if (!role) {
      throw new BadRequestException('User can not be created');
    }

    const user = {
      email: command.email,
      fullName: command.fullName,
      password: command.password,
      roleId: role.id,
      signupMethod: SignupMethodEnum.EMAIL,
      status: UserStatusEnum.INACTIVE,
    };

    const createdUser = await this.authRepository.create(user);
    if (!createdUser) {
      throw new BadRequestException('User can not be created');
    }

    await this.sendVerifyEmailCommandHandler.handle(new SendVerificationCommand(createdUser.id));

    return createdUser;
  }
}
