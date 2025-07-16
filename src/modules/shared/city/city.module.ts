import { Module } from '@nestjs/common';
import { ICountryRepository } from './domain/country.repository.interface';
import { CountryRepositoryImpl } from './infrastructure/country.repository';

import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { ICityRepository } from './domain/city.repository.interface';
import { CityRepositoryImpl } from './infrastructure/city.repository';
import { CityController } from './ui/city.controller';
import { CreateCityCommandHandler } from './application/handler/create-city-command.handler';
import { FindCityByIdCommandQuery } from './application/query/find-city-by-id.command.query';
import { FetchCitiesCommandQuery } from './application/query/fetch-cities.command.query';
import { UpdateCityCommandHandler } from './application/handler/update-city.command.handler';
import { DeleteCityCommandHandler } from './application/handler/delete-city.command.handler';
import { CityPublicController } from './ui/city.public.controller';
import { FetchCitiesPublicCommandQuery } from './application/query/fetch-cities.public.command.query';

@Module({
  imports: [DatabaseModule],
  controllers: [CityController, CityPublicController],
  providers: [
    {
      provide: ICountryRepository,
      useClass: CountryRepositoryImpl,
    },
    {
      provide: ICityRepository,
      useClass: CityRepositoryImpl,
    },

    CreateCityCommandHandler,
    FindCityByIdCommandQuery,
    FetchCitiesCommandQuery,
    FetchCitiesPublicCommandQuery,
    UpdateCityCommandHandler,
    DeleteCityCommandHandler,
  ],
})
export class CityModule {}
