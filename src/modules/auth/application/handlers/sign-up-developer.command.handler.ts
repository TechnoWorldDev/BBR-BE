import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { IAuthRepository } from 'src/modules/auth/domain/auth.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { SignupMethodEnum } from 'src/shared/types/signup-method.enum';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';
import { SignUpDeveloperCommand } from '../commands/sign-up-developer.command';
import { SendVerificationCommand } from 'src/modules/user/application/command/send-verification.command';
import { SendVerifyEmailCommandHandler } from 'src/modules/user/application/handler/send-verify-email.command.handler';
import { User } from 'src/modules/user/domain/user.entity';

@Injectable()
export class SignUpDeveloperCommandHandler {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly sendVerifyEmailCommandHandler: SendVerifyEmailCommandHandler
  ) {}

  @LogMethod()
  async handler(command: SignUpDeveloperCommand): Promise<User> {
    const existingUser = await this.authRepository.findByEmail(command.email!);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // find user role 'Developer' by name
    const role = await this.authRepository.findRoleByName('Developer');

    if (!role) {
      throw new BadRequestException('User can not be created');
    }

    const user = {
      email: command.email,
      fullName: command.fullName,
      password: command.password,
      companyName: command.companyName,
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
