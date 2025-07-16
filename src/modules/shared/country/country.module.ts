import { Module } from '@nestjs/common';
import { CountryController } from './ui/country.controller';
import { ICountryRepository } from './domain/country.repository.interface';
import { CountryRepositoryImpl } from './infrastructure/country.repository';
import { CreateCountryCommandHandler } from './application/handler/create-country.command.handler';
import { FindCountryByIdCommandQuery } from './application/query/find-country-by-id.command.query';
import { FetchCountriesCommandQuery } from './application/query/fetch-countries.command.query';
import { UpdateCountryCommandHandler } from './application/handler/update-country.command.handler';
import { DeleteCountryCommandHandler } from './application/handler/delete-country.command.handler';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { IContinentRepository } from '../continent/domain/continent.repository.interface';
import { ContinentRepositoryImpl } from '../continent/infrastrucure/continent.repository';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { MediaRepositoryImpl } from 'src/modules/media/infrastructure/media.repository';
import { IPhoneCodeRepository } from '../phone_code/domain/phone-code.repository.interface';
import { PhoneCodeRepositoryImpl } from '../phone_code/infrastructure/phone-code.repository';
import { CountryPublicController } from './ui/country.public.controller';
import { FetchCountriesPublicCommandQuery } from './application/query/fetch-countries.public.command.query';

@Module({
  imports: [DatabaseModule],
  controllers: [CountryController, CountryPublicController],
  providers: [
    {
      provide: ICountryRepository,
      useClass: CountryRepositoryImpl,
    },
    {
      provide: IContinentRepository,
      useClass: ContinentRepositoryImpl,
    },
    {
      provide: IPhoneCodeRepository,
      useClass: PhoneCodeRepositoryImpl,
    },
    CreateCountryCommandHandler,
    FindCountryByIdCommandQuery,
    FetchCountriesCommandQuery,
    FetchCountriesPublicCommandQuery,
    UpdateCountryCommandHandler,
    DeleteCountryCommandHandler,
  ],
})
export class CountryModule {}
