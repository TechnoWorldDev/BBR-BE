import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendRequestInformationCommand } from './command/send-request-information';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';

@Injectable()
export class SendRequestInformationEmailCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendRequestInformationCommand) {
    return await this.emailRepository.sendEmail(
      command.to,
      'Thank You for Your Interest!',
      EmailTemplatesEnum.REQUEST_INFORMATION,
      {
        fullName: command.fullName,
        residenceName: command.residenceName,
        exploreMoreResidencesLink: command.exploreMoreResidencesLink,
      }
    );
  }
}
