import { Injectable } from '@nestjs/common';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendContactUsEmailCommand } from './command/send-contact-us.command';

@Injectable()
export class SendContactUsEmailCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}
  async handle(command: SendContactUsEmailCommand) {
    return await this.emailRepository.sendEmail(
      command.to,
      'Thank You for Reaching Out!',
      EmailTemplatesEnum.CONTACT_US,
      {
        fullName: command.fullName,
        exploreMoreResidencesLink: command.exploreMoreResidencesLink,
      }
    );
  }
}
