import { ConflictException, Injectable } from '@nestjs/common';
import { NotFoundByIdException } from 'src/shared/error/exception/not-found-by-id.exception';
import { ErrorSpecification } from 'src/shared/error/specs/error-specification';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { User } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository.interface';
import { UpdateUserCommand } from '../command/update-user.command';

@Injectable()
export class UpdateUserCommandHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  @LogMethod()
  async handle(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.findById(command.id);

    if (!user) {
      throw NotFoundByIdException.notFoundByIdException(
        command.id,
        ErrorSpecification.USER_NOT_FOUND
      );
    }

    if (command.email) {
      const existingUser = await this.userRepository.findByEmail(command.email);

      if (existingUser) {
        if (existingUser.id !== command.id) {
          throw new ConflictException('Email is already registered');
        }
      }
    }

    return this.userRepository.update(user.id, command);
  }
}
