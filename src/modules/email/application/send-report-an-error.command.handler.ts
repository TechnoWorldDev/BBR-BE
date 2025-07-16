import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendReportAnErrorCommand } from './command/send-report-an-error.command';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';

@Injectable()
export class SendReportAnErrorCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendReportAnErrorCommand) {
    return await this.emailRepository.sendEmail(
      command.to,
      'Thanks for Letting Us Know!',
      EmailTemplatesEnum.REPORT_AN_ERROR,
      {
        fullName: command.fullName,
        exploreMoreResidencesLink: command.exploreMoreResidencesLink,
      }
    );
  }
}
