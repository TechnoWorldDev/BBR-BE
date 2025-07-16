import { Injectable } from '@nestjs/common';
import { IAuthRepository } from 'src/modules/auth/domain/auth.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { FindByEmailQuery } from '../commands/find-by-email.query';

@Injectable()
export class FindByEmailQueryHandler {
  constructor(private readonly authRepository: IAuthRepository) {}

  @LogMethod()
  async handler(command: FindByEmailQuery) {
    const user = this.authRepository.findByEmail(command.email);
    return user;
  }
}
