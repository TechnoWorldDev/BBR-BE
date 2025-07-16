import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { MediaModule } from 'src/modules/media/media.module';
import { ClaimProfileContactFormController } from './ui/claim-profile-contact-form.controller';
import { IClaimProfileContactFormRepository } from './domain/claim-profile-contact-form.repository';
import { ClaimProfileContactFormRepositoryImpl } from './infrastructure/claim-profile-contact-form.repository.impl';
import { CreateClaimProfileContactFormCommandHandler } from './application/handler/create-claim-profile-contact-form.command.handler';
import { FindClaimProfileContactFormByIdCommandQuery } from './application/query/find-claim-profile-contact-form-by-id.command.query';
import { FetchClaimProfileContactFormsCommandQuery } from './application/query/fetch-claim-profile-contact-forms.command.query';
import { UpdateClaimProfileContactFormCommandHandler } from './application/handler/update-claim-profile-contact-form.command.handler';
import { UpdateClaimProfileContactFormStatusCommandHandler } from './application/handler/update-claim-profile-contact-form-status.command.handler';
import { DeleteClaimProfileContactFormCommandHandler } from './application/handler/delete-claim-profile-contact-form.command.handler';
import { ClaimProfileContactFormMapper } from './ui/mapper/claim-profile-contact-form.mapper';
import { IPhoneCodeRepository } from '../../shared/phone_code/domain/phone-code.repository.interface';
import { PhoneCodeRepositoryImpl } from '../../shared/phone_code/infrastructure/phone-code.repository';
import { IResidenceRepository } from './domain/residence.repository.interface';
import { ResidenceRepositoryImpl } from './infrastructure/residence.repository.impl';
import { IUserRepository } from './domain/user.repository.interface';
import { UserRepositoryImpl } from './infrastructure/user.repository.impl';
import EmailModule from 'src/modules/email/email.module';

@Module({
  imports: [DatabaseModule, MediaModule, EmailModule],
  controllers: [ClaimProfileContactFormController],
  providers: [
    {
      provide: IClaimProfileContactFormRepository,
      useClass: ClaimProfileContactFormRepositoryImpl,
    },
    {
      provide: IPhoneCodeRepository,
      useClass: PhoneCodeRepositoryImpl,
    },
    {
      provide: IResidenceRepository,
      useClass: ResidenceRepositoryImpl,
    },
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
    CreateClaimProfileContactFormCommandHandler,
    FindClaimProfileContactFormByIdCommandQuery,
    FetchClaimProfileContactFormsCommandQuery,
    UpdateClaimProfileContactFormCommandHandler,
    UpdateClaimProfileContactFormStatusCommandHandler,
    DeleteClaimProfileContactFormCommandHandler,
    ClaimProfileContactFormMapper,
  ],
})
export class ClaimProfileModule {}
