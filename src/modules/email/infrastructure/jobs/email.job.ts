import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SendEmailCommand } from '../../application/command/send-email.command';
import { EmailAction } from '../../domain/email-action.enum';
import { IProcessJob } from '../../domain/process-job.interface';
import { EmailHandlerRegistry } from '../registry/email-handler.registry';

@Processor('email-queue')
export class EmailJobProcessor extends WorkerHost {
  constructor(private readonly registry: EmailHandlerRegistry) {
    super();
  }

  async process(job: Job) {
    const data = job.data as IProcessJob;
    const command = new SendEmailCommand(data.to, '', '', data.variables!);

    const handler = this.registry.getHandler(data.action as EmailAction);

    await handler(command);
  }
}
