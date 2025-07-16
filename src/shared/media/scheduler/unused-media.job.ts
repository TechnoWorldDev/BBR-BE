import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { IMediaService } from '../media.service.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class UnusedMediaJob {
  private isRunning = false;

  constructor(private readonly mediaService: IMediaService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  @LogMethod()
  async deleteUnusedMedia() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true; // Lock execution

    try {
      const date = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
      await this.mediaService.deleteUnusedMediaCreatedAfterDate(date);
    } catch (error) {
      console.error(error);
    } finally {
      this.isRunning = false; // Unlock execution
    }
  }
}
