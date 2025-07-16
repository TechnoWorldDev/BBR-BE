import { Injectable } from '@nestjs/common';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendRegisterResidenceCommand } from './command/send-register-residence.command';

@Injectable()
export class SendRegisterResidenceCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendRegisterResidenceCommand) {
    return await this.emailRepository.sendEmail(
      command.to,
      'Thank You for Registering Your Residence!',
      EmailTemplatesEnum.REGISTER_RESIDENCE,
      {
        fullName: command.fullName,
        residenceName: command.residenceName,
        manageResidencesLink: command.manageResidencesLink,
      }
    );
  }
}
