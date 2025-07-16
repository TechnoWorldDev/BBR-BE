import { Injectable } from '@nestjs/common';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendRejectedResidenceCommand } from './command/send-rejected-residence.command';

@Injectable()
export class SendRejectedResidenceCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendRejectedResidenceCommand) {
    await this.emailRepository.sendEmail(
      command.to,
      'Your Residence Needs Attention',
      EmailTemplatesEnum.REJECTED_RESIDENCE,
      {
        fullName: command.fullName,
        residenceName: command.residenceName,
        manageResidencesLink: command.manageResidencesLink,
      }
    );
  }
}
