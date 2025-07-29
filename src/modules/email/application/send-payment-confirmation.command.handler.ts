import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendPaymentConfirmationCommand } from './command/send-payment-confirmation.command';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';

@Injectable()
export class SendPaymentConfirmationCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendPaymentConfirmationCommand) {
    return await this.emailRepository.sendEmail(
      command.to,
      "You're In! Let's Finalize Your Setup on BBR",
      EmailTemplatesEnum.PAYMENT_CONFIRMATION,
      {
        fullName: command.fullName,
        residenceName: command.residenceName,
        scheduleCallLink: command.scheduleCallLink,
      }
    );
  }
} 