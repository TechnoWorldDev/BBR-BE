import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendWelcomeEmailCommand } from './command/send-welcome.command';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';

@Injectable()
export class SendWelcomeEmailCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendWelcomeEmailCommand): Promise<any> {
    return await this.emailRepository.sendEmail(command.to, 'Welcome', EmailTemplatesEnum.WELCOME, {
      fullName: command.fullName,
      verificationLink: command.verificationLink,
    });
  }
}
