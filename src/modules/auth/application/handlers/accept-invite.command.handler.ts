import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IInviteRepository } from 'src/modules/user/domain/invite.repository.interface';
import { IUserRepository } from 'src/modules/user/domain/user.repository.interface';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';
import { AcceptInviteCommand } from '../commands/accept-invite.command';

@Injectable()
export class AcceptInviteCommandHandler {
  constructor(
    private readonly inviteRepo: IInviteRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async handle(command: AcceptInviteCommand): Promise<void> {
    const invite = await this.inviteRepo.findByToken(command.token);

    if (!invite) throw new NotFoundException('Invite not found');

    if (invite.acceptedAt) throw new BadRequestException('Invite has already been used');

    if (new Date(invite.expiresAt) < new Date()) {
      throw new BadRequestException('Invite has expired');
    }

    const existingUser = await this.userRepo.findByEmail(invite.email);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (command.password) {
      await this.userRepo.update(existingUser.id, {
        password: command.password,
        emailVerified: true,
        status: UserStatusEnum.ACTIVE,
        updatedAt: new Date(),
      });
    } else {
      await this.userRepo.update(existingUser.id, {
        emailVerified: true,
        status: UserStatusEnum.ACTIVE,
        updatedAt: new Date(),
      });
    }

    await this.inviteRepo.markAsAccepted(invite.id);
  }
}
