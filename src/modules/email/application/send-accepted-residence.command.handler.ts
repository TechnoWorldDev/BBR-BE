import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendAcceptedResidenceCommand } from './command/send-accepted-residence.command';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';

@Injectable()
export class SendAcceptedResidenceCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendAcceptedResidenceCommand) {
    await this.emailRepository.sendEmail(
      command.to,
      'Your Residence Is Now Live!',
      EmailTemplatesEnum.ACCEPTED_RESIDENCE,
      {
        fullName: command.fullName,
        residenceName: command.residenceName,
        manageResidencesLink: command.manageResidencesLink,
      }
    );
  }
}
