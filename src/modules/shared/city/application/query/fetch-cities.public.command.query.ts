import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchCitiesQuery } from '../commands/fetch-cities.query';
import { ICityRepository } from '../../domain/city.repository.interface';
import { City } from '../../domain/city.entity';

@Injectable()
export class FetchCitiesPublicCommandQuery {
  constructor(private readonly cityRepository: ICityRepository) {}

  @LogMethod()
  async handler(
    query: FetchCitiesQuery
  ): Promise<{ data: City[]; pagination: PaginationResponse }> {
    const result = await this.cityRepository.findAllPublic(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
