import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { ICareerContactFormRepository } from './domain/career-contact-form.repository.interface';
import { CareerContactFormRepositoryImpl } from './infrastructure/career-contact-form.repository';
import { CareerContactFormController } from './ui/career-contact-form.controller';
import { FindCareerContactFormByIdCommandQuery } from './application/query/find-by-id-career-contact-form.query';
import { FetchCareerContactFormsCommandQuery } from './application/query/fetch-career-contact-forms.query';
import { CareerContactFormMapper } from './ui/mapper/career-contact-form.mapper';
import { CreateCareerContactFormCommandHandler } from './application/handler/create-career-contact-form.handler';
import { UpdateCareerContactFormCommandHandler } from './application/handler/update-career-contact-form.handler';
import { UpdateCareerContactFormStatusCommandHandler } from './application/handler/update-career-contact-form-status.handler';
import { MediaModule } from 'src/modules/media/media.module';
import { DeleteCareerContactFormCommandHandler } from './application/handler/delete-career-contact-form.handler';
import EmailModule from 'src/modules/email/email.module';

@Module({
  imports: [DatabaseModule, MediaModule, EmailModule],
  controllers: [CareerContactFormController],
  providers: [
    {
      provide: ICareerContactFormRepository,
      useClass: CareerContactFormRepositoryImpl,
    },
    CreateCareerContactFormCommandHandler,
    FindCareerContactFormByIdCommandQuery,
    FetchCareerContactFormsCommandQuery,
    UpdateCareerContactFormCommandHandler,
    DeleteCareerContactFormCommandHandler,
    UpdateCareerContactFormStatusCommandHandler,
    CareerContactFormMapper,
  ],
})
export class CareerContactFormModule {}
