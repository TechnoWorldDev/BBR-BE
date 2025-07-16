import { Injectable } from '@nestjs/common';
import { IEmailRepository } from '../domain/email.repository.interface';
import { SendEmailCommand } from './command/send-email.command';

@Injectable()
export class SendEmailCommandHandler {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async handle(command: SendEmailCommand): Promise<any> {
    return await this.emailRepository.sendEmail(
      command.to,
      command.subject,
      command.template,
      command.variables
    );
  }
}
