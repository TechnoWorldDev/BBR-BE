import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendSuggestFeatureCommand } from './command/send-suggest-feature.command';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';

@Injectable()
export class SendSuggestFeatureCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendSuggestFeatureCommand) {
    return await this.emailRepository.sendEmail(
      command.to,
      'We’ve Received Your Suggestion!',
      EmailTemplatesEnum.SUGGEST_FEATURE,
      { fullName: command.fullName, exploreMoreResidencesLink: command.exploreMoreResidencesLink }
    );
  }
}
