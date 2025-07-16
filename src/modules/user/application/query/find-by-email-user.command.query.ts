import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { User } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository.interface';

@Injectable()
export class FindByEmailUserQueryHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  @LogMethod()
  async handle(email: string): Promise<User> {
    const findByEmail = await this.userRepository.findByEmail(email);

    if (!findByEmail) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userRepository.findById(findByEmail.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
