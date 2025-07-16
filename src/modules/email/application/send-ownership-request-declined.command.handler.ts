import { Injectable } from '@nestjs/common';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendOwnershipRequestDeclinedCommand } from './command/send-ownership-request-declined.command';

@Injectable()
export class SendOwnershipRequestDeclinedCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendOwnershipRequestDeclinedCommand) {
    await this.emailRepository.sendEmail(
      command.to,
      "We Couldn't Verify Ownership",
      EmailTemplatesEnum.OWNERSHIP_REQUEST_DECLINED,
      {
        fullName: command.fullName,
        residenceName: command.residenceName,
        manageResidencesLink: command.manageResidencesLink,
      }
    );
  }
}
