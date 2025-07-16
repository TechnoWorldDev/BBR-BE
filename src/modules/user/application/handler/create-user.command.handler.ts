import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { User } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository.interface';
import { CreateUserCommand } from '../command/create-user.command';
import { IInviteRepository } from '../../domain/invite.repository.interface';
import { InviteUserCommandHandler } from './invite-user-command.handler';
import { InviteUserCommand } from '../command/invite-user.command';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';
import { IRoleRepository } from 'src/modules/role/domain/role.repository.interface';

@Injectable()
export class CreateUserCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly inviteUserCommandHandler: InviteUserCommandHandler
  ) {}

  @LogMethod()
  async handle(command: CreateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const validRole = await this.roleRepository.findById(command.roleId);

    if (!validRole) {
      throw new ConflictException('Role not found');
    }

    const { createdBy, ...commandUser } = command;

    const newUser: Partial<User> = {
      ...commandUser,
      status: UserStatusEnum.INACTIVE,
    };

    const createdUser = await this.userRepository.create(newUser);

    if (!createdUser) {
      throw new InternalServerErrorException('User not saved');
    }

    // * send invite link
    if (command.emailNotifications) {
      const inviteUserCommand = new InviteUserCommand(
        command.email,
        command.roleId,
        command.password,
        createdBy!
      );

      await this.inviteUserCommandHandler.handle(inviteUserCommand);
    }

    const created = await this.userRepository.findById(createdUser.id);

    if (!created) {
      throw new InternalServerErrorException('User not saved');
    }

    return created;
  }
}
