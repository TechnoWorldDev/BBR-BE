import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailAction } from 'src/modules/email/domain/email-action.enum';
import { EmailQueue } from 'src/modules/email/infrastructure/queues/email.queue';
import { FrontendRoutes } from 'src/shared/constants/frontend-routes';
import { v4 as uuid } from 'uuid';
import { IEmailVerificationRepository } from '../../domain/email-verification.repository.interface';
import { SendVerificationCommand } from '../command/send-verification.command';
import { FindByIdUserCommandHandler } from '../query/find-by-id-user.command.query';

@Injectable()
export class SendVerifyEmailCommandHandler {
  constructor(
    private readonly repo: IEmailVerificationRepository,
    private readonly emailQueue: EmailQueue,
    private readonly configService: ConfigService,
    private readonly findByIdUserHandler: FindByIdUserCommandHandler
  ) {}

  async handle(command: SendVerificationCommand): Promise<void> {
    const token = uuid();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h

    const userExist = await this.findByIdUserHandler.handle(command.userId);

    const alreadyInvited = await this.repo.findByUserId(command.userId);

    if (alreadyInvited) {
      await this.repo.markAsVerified(alreadyInvited.id);
    }

    if (!userExist) {
      throw new NotFoundException('User not found');
    }

    await this.repo.create({
      userId: command.userId,
      token,
      expiresAt,
    });

    const verificationLink = `${this.configService.get<string>('FRONTEND_URL')}${FrontendRoutes.VERIFY_EMAIL}?token=${token}`;

    await this.emailQueue.addEmailJob(EmailAction.VERIFY_EMAIL, {
      to: userExist.email,
      variables: { verificationLink: verificationLink },
    });
  }
}
