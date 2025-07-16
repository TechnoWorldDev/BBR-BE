import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { IContactFormRepository } from './domain/contact-form.repository.interface';
import { ContactFormMapper } from './ui/mapper/contact-form.mapper';
import { MediaModule } from 'src/modules/media/media.module';
import { ContactFormController } from './ui/contact-form.controller';
import { ContactFormRepositoryImpl } from './infrastructure/contact-form.repository.impl';
import { CreateContactFormCommandHandler } from './application/handler/create-contact-form.command-handler';
import { FindContactFormByIdCommandQuery } from './application/query/find-contact-form-by-id-command.query';
import { FetchContactFormsCommandQuery } from './application/query/fetch-contact-forms-command.query';
import { UpdateContactFormCommandHandler } from './application/handler/update-contact-form.command-handler';
import { DeleteContactFormCommandHandler } from './application/handler/delete-contact-form.command-handler';
import EmailModule from 'src/modules/email/email.module';

@Module({
  imports: [DatabaseModule, EmailModule, MediaModule],
  controllers: [ContactFormController],
  providers: [
    {
      provide: IContactFormRepository,
      useClass: ContactFormRepositoryImpl,
    },
    CreateContactFormCommandHandler,
    FindContactFormByIdCommandQuery,
    FetchContactFormsCommandQuery,
    UpdateContactFormCommandHandler,
    DeleteContactFormCommandHandler,
    ContactFormMapper,
  ],
})
export class ContactFormModule {}
