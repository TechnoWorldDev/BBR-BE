import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchCountriesQuery } from '../commands/fetch-countries.query';
import { ICountryRepository } from '../../domain/country.repository.interface';
import { Country } from '../../domain/country.entity';

@Injectable()
export class FetchCountriesPublicCommandQuery {
  constructor(private readonly countryRepository: ICountryRepository) {}

  @LogMethod()
  async handler(
    query: FetchCountriesQuery
  ): Promise<{ data: Country[]; pagination: PaginationResponse }> {
    const result = await this.countryRepository.findAllPublic(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
