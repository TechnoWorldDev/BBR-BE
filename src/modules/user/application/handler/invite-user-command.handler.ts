import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailAction } from 'src/modules/email/domain/email-action.enum';
import { EmailQueue } from 'src/modules/email/infrastructure/queues/email.queue';
import { FrontendRoutes } from 'src/shared/constants/frontend-routes';
import { v4 as uuid } from 'uuid';
import { IInviteRepository } from '../../domain/invite.repository.interface';
import { InviteUserCommand } from '../command/invite-user.command';

@Injectable()
export class InviteUserCommandHandler {
  constructor(
    private readonly inviteRepo: IInviteRepository,
    private readonly configService: ConfigService,
    private readonly emailQueue: EmailQueue
  ) {}

  async handle(command: InviteUserCommand): Promise<void> {
    const token = uuid();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h

    await this.inviteRepo.create({
      email: command.email,
      token,
      role: command.role,
      expiresAt,
      createdBy: command.createdBy,
    });

    const inviteLink = `${this.configService.get<string>('FRONTEND_URL')}${FrontendRoutes.INVITE_USER}?token=${token}`;

    await this.emailQueue.addEmailJob(EmailAction.INVITE, {
      to: command.email,
      variables: { inviteLink, tempPassword: command.tempPassword },
    });
  }
}
