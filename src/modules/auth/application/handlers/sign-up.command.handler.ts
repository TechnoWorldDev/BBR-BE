import { ConflictException, Injectable } from '@nestjs/common';
import { IAuthRepository } from 'src/modules/auth/domain/auth.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { SignUpCommand } from '../commands/sign-up.command';

@Injectable()
export class SignUpCommandHandler {
  constructor(private readonly authRepository: IAuthRepository) {}

  @LogMethod()
  async handler(command: SignUpCommand) {
    const existingUser = await this.authRepository.findByEmail(command.email!);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }
    return this.authRepository.create(command);
  }
}
