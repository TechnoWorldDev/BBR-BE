import { Injectable } from '@nestjs/common';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendPremiumSubscriptionCommand } from './command/send-premium-subscription.command';

@Injectable()
export class SendPremiumSubscriptionCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendPremiumSubscriptionCommand) {
    return await this.emailRepository.sendEmail(
      command.to,
      "You're Now a Premium Member",
      EmailTemplatesEnum.PREMIUM_SUBSCRIPTION,
      {
        fullName: command.fullName,
        manageResidencesLink: command.manageResidencesLink,
      }
    );
  }
}
