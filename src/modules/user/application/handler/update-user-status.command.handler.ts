import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IUserRepository } from '../../domain/user.repository.interface';
import { UpdateUserStatusCommand } from '../command/update-user-status.command';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';

@Injectable()
export class UpdateUserStatusCommandHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  @LogMethod()
  async handle(command: UpdateUserStatusCommand): Promise<void> {
    const existingUser = await this.userRepository.findById(command.id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.userRepository.update(command.id, {
      status: command.status as UserStatusEnum,
    });

    if (!updated) {
      throw new InternalServerErrorException('Failed to update user status');
    }
  }
}
