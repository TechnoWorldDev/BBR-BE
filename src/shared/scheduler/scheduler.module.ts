import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UnusedMediaJob } from '../media/scheduler/unused-media.job';

@Module({
  imports: [ScheduleModule.forRoot()],
  exports: [ScheduleModule],
})
export class SchedulerModule {}
