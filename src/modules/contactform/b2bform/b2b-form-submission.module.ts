import { Module } from '@nestjs/common';
import EmailModule from 'src/modules/email/email.module';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { CreateB2BFormSubmissionCommandHandler } from './application/handler/create-b2b-form-submission-command.handler';
import { DeleteB2BFormSubmissionCommandHandler } from './application/handler/delete-b2b-form-submission-command.handler';
import { UpdateB2BFormSubmissionCommandHandler } from './application/handler/update-b2b-form-submission-command.handler';
import { UpdateB2BFormSubmissionStatusCommandHandler } from './application/handler/update-b2b-form-submission-status-command.handler';
import { FetchB2BFormSubmissionsCommandQuery } from './application/query/fetch-b2b-form-submissions.query.handler';
import { FindB2BFormSubmissionByIdCommandQuery } from './application/query/find-b2b-form-submission-by-id.query.handler';
import { IB2BFormSubmissionRepository } from './domain/b2b-form-submission.repository.interface';
import { B2BFormSubmissionRepositoryImpl } from './infrastructure/b2b-form-submission.repository.impl';
import { B2BFormSubmissionController } from './ui/b2b-form-submission.controller';
import { B2BFormSubmissionMapper } from './ui/mapper/b2b-form-submission.mapper';

@Module({
  imports: [DatabaseModule, EmailModule],
  controllers: [B2BFormSubmissionController],
  providers: [
    {
      provide: IB2BFormSubmissionRepository,
      useClass: B2BFormSubmissionRepositoryImpl,
    },
    CreateB2BFormSubmissionCommandHandler,
    FindB2BFormSubmissionByIdCommandQuery,
    FetchB2BFormSubmissionsCommandQuery,
    UpdateB2BFormSubmissionCommandHandler,
    UpdateB2BFormSubmissionStatusCommandHandler,
    DeleteB2BFormSubmissionCommandHandler,
    B2BFormSubmissionMapper,
  ],
})
export class B2BFormSubmissionModule {}
