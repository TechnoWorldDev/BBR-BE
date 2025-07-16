import { Injectable } from '@nestjs/common';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendOwnershipRequestAcceptedCommand } from './command/send-ownership-request-accepted.command';

@Injectable()
export class SendOwnershipRequestAcceptedCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendOwnershipRequestAcceptedCommand) {
    await this.emailRepository.sendEmail(
      command.to,
      "You're Now Listed as the Owner!",
      EmailTemplatesEnum.OWNERSHIP_REQUEST_ACCEPTED,
      {
        fullName: command.fullName,
        residenceName: command.residenceName,
        manageResidencesLink: command.manageResidencesLink,
      }
    );
  }
}
