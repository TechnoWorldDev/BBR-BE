import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendResetPasswordEmailCommand } from './command/send-reset-password-email.command';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';

@Injectable()
export class SendResetPasswordEmailCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendResetPasswordEmailCommand): Promise<any> {
    return await this.emailRepository.sendEmail(
      command.email,
      'Reset Password',
      EmailTemplatesEnum.RESET_PASSWORD,
      {
        otp: command.otp,
      }
    );
  }
}
