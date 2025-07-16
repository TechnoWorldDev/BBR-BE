import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendJobApplicationCommand } from './command/send-job-application.command';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';

@Injectable()
export class SendJobApplicationCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendJobApplicationCommand) {
    return await this.emailRepository.sendEmail(
      command.to,
      'Thank You for Applying!',
      EmailTemplatesEnum.JOB_APPLICATION,
      {
        fullName: command.fullName,
        exploreMoreOpportunitiesLink: command.exploreMoreOpportunitiesLink,
      }
    );
  }
}
