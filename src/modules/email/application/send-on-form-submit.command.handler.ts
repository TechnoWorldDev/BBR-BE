import { Injectable } from '@nestjs/common';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendOnFormSubmitCommand } from './command/send-on-form-submit.command';

@Injectable()
export class SendOnFormSubmitCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendOnFormSubmitCommand) {
    return await this.emailRepository.sendEmail(
      command.email,
      'Best Branded Residences',
      EmailTemplatesEnum.ON_FORM_SUBMIT,
      {
        fullName: command.fullName,
      }
    );
  }
}
