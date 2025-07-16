import { Injectable } from '@nestjs/common';
import { SendSubmitReviewCommand } from './command/send-submit-review';
import { IEmailRepository } from '../domain/email.repository.interface';
import { EmailTemplatesEnum } from '../domain/email-templates.enum';

@Injectable()
export class SendSubmitReviewCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendSubmitReviewCommand) {
    return await this.emailRepository.sendEmail(
      command.to,
      'Your Review Has Been Submitted!',
      EmailTemplatesEnum.SUBMIT_REVIEW,
      {
        fullName: command.fullName,
        residenceName: command.residenceName,
        exploreMoreResidencesLink: command.exploreMoreResidencesLink,
      }
    );
  }
}
