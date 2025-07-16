import { Queue, Worker } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { EmailJobProcessor } from '../jobs/email.job';
import { ConfigService } from '@nestjs/config';
import { QueuesEnum } from 'src/shared/types/queues.enum';
import { EmailAction } from '../../domain/email-action.enum';

@Injectable()
export class EmailQueue {
  private queue: Queue;
  private worker: Worker;

  constructor(
    private readonly emailJobProcessor: EmailJobProcessor,
    private readonly configService: ConfigService
  ) {
    const redisHost = this.configService.get<string>('REDIS_HOST');
    const redisPort = this.configService.get<number>('REDIS_PORT');
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD');

    const redisConfig = {
      host: redisHost,
      port: redisPort,
      password: redisPassword,
    };

    this.queue = new Queue(QueuesEnum.EMAIL, {
      connection: redisConfig,
    });

    this.worker = new Worker(
      QueuesEnum.EMAIL,
      async (job) => {
        try {
          await this.emailJobProcessor.process(job);
        } catch (error) {
          console.error(`[EMAIL QUEUE] Job ${job.id} failed:`, error);
          throw error;
        }
      },
      { connection: redisConfig, concurrency: 5 }
    );

    this.worker.on('failed', (job, err) => {
      console.error(`[EMAIL QUEUE] Job ${job?.id} failed`, err);
    });

    this.worker.on('completed', (job) => {
      console.log(`[EMAIL QUEUE] Job ${job.id} completed`);
    });

    this.worker.on('error', (err) => {
      console.error('[EMAIL QUEUE] Worker error:', err);
    });
  }

  async addEmailJob(
    action: EmailAction,
    data: {
      to: string;
      subject?: string;
      template?: string;
      variables?: Record<string, any>;
    }
  ) {
    const job = await this.queue.add(
      QueuesEnum.EMAIL,
      { action, ...data },
      {
        jobId: `${action}:${data.to}:${Date.now()}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 5 * 60 * 1000 }, // 5 minutes
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
  }
}
