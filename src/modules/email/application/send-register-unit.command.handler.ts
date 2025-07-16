import { Injectable } from '@nestjs/common';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendRegisterUnitCommand } from './command/send-register-unit.command';

@Injectable()
export class SendRegisterUnitCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendRegisterUnitCommand) {
    return await this.emailRepository.sendEmail(
      command.to,
      'Thank You for Registering Your Unit!',
      EmailTemplatesEnum.REGISTER_UNIT,
      {
        fullName: command.fullName,
        unitName: command.unitName,
        manageResidencesLink: command.manageResidencesLink,
      }
    );
  }
}
