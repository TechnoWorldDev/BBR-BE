import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { PhoneCodeController } from './ui/phone-code.controller';
import { IPhoneCodeRepository } from './domain/phone-code.repository.interface';
import { PhoneCodeRepositoryImpl } from './infrastructure/phone-code.repository';
import { FindPhoneCodeByIdCommandQuery } from './application/query/find-phone-code-by-id-command.query';
import { FetchPhoneCodesCommandQuery } from './application/query/fetch-phone-codes-command.query';

@Module({
  imports: [DatabaseModule],
  controllers: [PhoneCodeController],
  providers: [
    {
      provide: IPhoneCodeRepository,
      useClass: PhoneCodeRepositoryImpl,
    },
    FindPhoneCodeByIdCommandQuery,
    FetchPhoneCodesCommandQuery,
  ],
})
export class PhoneCodeModule {}
