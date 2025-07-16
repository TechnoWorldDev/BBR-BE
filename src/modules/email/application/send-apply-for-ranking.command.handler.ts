import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendApplyForRankingCommand } from './command/send-apply-for-ranking.command';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';

@Injectable()
export class SendApplyForRankingCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendApplyForRankingCommand) {
    return await this.emailRepository.sendEmail(
      command.to,
      'Your Application Is on Its Way!',
      EmailTemplatesEnum.APPLY_FOR_RANKING,
      {
        fullName: command.fullName,
        residenceName: command.residenceName,
        categoryName: command.categoryName,
        exploreMoreResidencesLink: command.exploreMoreResidencesLink,
      }
    );
  }
}
