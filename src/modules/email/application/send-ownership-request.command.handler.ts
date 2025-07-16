import { Injectable } from '@nestjs/common';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendOwnershipRequestCommand } from './command/send-ownership-request.command';

@Injectable()
export class SendOwnershipRequestCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendOwnershipRequestCommand) {
    await this.emailRepository.sendEmail(
      command.to,
      'Ownership Request Received',
      EmailTemplatesEnum.OWNERSHIP_REQUEST,
      {
        fullName: command.fullName,
        residenceName: command.residenceName,
        manageResidencesLink: command.manageResidencesLink,
      }
    );
  }
}
