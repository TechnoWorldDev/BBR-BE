import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendAcceptedResidenceCommand } from './command/send-accepted-residence.command';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { SendB2BFormCommand } from './command/send-b2b-form';

@Injectable()
export class SendB2BFormCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendB2BFormCommand) {
    await this.emailRepository.sendEmail(
      command.to,
      'Thanks for Reaching Out!',
      EmailTemplatesEnum.B2B_FORM,
      {
        fullName: command.fullName,
        residenceName: command.residenceName,
        companyName: command.companyName,
        exploreMoreResidencesLink: command.exploreMoreResidencesLink,
      }
    );
  }
}
