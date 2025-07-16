import { Injectable } from '@nestjs/common';
import { SendContactConsultationEmailCommand } from './command/send-contact-consultation';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { IEmailRepository } from '../domain/email.repository.interface';

@Injectable()
export class SendContactConsultationEmailCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}
  async handle(command: SendContactConsultationEmailCommand) {
    return await this.emailRepository.sendEmail(
      command.to,
      'Thank You for Reaching Out!',
      EmailTemplatesEnum.CONTACT_CONSULTATION,
      {
        fullName: command.fullName,
        exploreMoreResidencesLink: command.exploreMoreResidencesLink,
      }
    );
  }
}
