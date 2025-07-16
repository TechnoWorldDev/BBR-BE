import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { SendVerifyEmailCommand } from './command/send-verify-email.command';

@Injectable()
export class SendVerifyEmailCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendVerifyEmailCommand): Promise<any> {
    return await this.emailRepository.sendEmail(
      command.email,
      'One Step Away from Your Account!',
      EmailTemplatesEnum.VERIFY_EMAIL,
      {
        verificationLink: command.verificationLink,
      }
    );
  }
}
