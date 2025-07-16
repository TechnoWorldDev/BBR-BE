import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendRequestPremiumProfileCommand } from './command/send-request-premium-profile.command';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';

@Injectable()
export class SendRequestPremiumProfileCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendRequestPremiumProfileCommand) {
    return await this.emailRepository.sendEmail(
      command.to,
      'Your Upgrade Request Is Under Review!',
      EmailTemplatesEnum.REQUEST_PREMIUM_PROFILE,
      {
        fullName: command.fullName,
        exploreMoreResidencesLink: command.exploreMoreResidencesLink,
      }
    );
  }
}
