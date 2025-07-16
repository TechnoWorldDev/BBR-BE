import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailCommand } from '../application/command/send-email.command';
import { SendEmailCommandHandler } from '../application/send-email.command.handler';

@Controller('email')
export class EmailController {
  constructor(private readonly sendEmailCommandHandler: SendEmailCommandHandler) {}

  @Post('send')
  async sendEmail(
    @Body()
    body: {
      recipient: string;
      subject: string;
      template: string;
      variables: Record<string, any>;
    }
  ) {
    const mail = new SendEmailCommand(body.recipient, body.subject, body.template, body.variables);

    await this.sendEmailCommandHandler.handle(mail);

    return { message: 'Email processing started' };
  }
}
