import { Injectable } from '@nestjs/common';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendInviteEmailCommand } from './command/send-invite-email.command';

@Injectable()
export class SendInviteEmailCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendInviteEmailCommand) {
    await this.emailRepository.sendEmail(
      command.email,
      'You’ve been invited!',
      EmailTemplatesEnum.INVITE,
      { inviteLink: command.inviteLink, tempPassword: command.tempPassword }
    );
  }
}
