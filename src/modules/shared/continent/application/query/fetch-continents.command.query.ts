import { Injectable } from '@nestjs/common';
import { LogMethod } from '../../../../../shared/infrastructure/logger/log.decorator';
import { FetchContinentsQuery } from '../command/fetch-continents.query';
import { ContinentResponse } from '../../ui/response/continent.response';
import { PaginationResponse } from '../../../../../shared/ui/response/pagination.response';
import { IContinentRepository } from '../../domain/continent.repository.interface';

@Injectable()
export class FetchContinentsCommandQuery {
  constructor(private readonly continentRepository: IContinentRepository) {}

  @LogMethod()
  async handler(
    query: FetchContinentsQuery
  ): Promise<{ data: ContinentResponse[]; pagination: PaginationResponse }> {
    const result = await this.continentRepository.findAll(query);
    return {
      data: result.data.map(
        (continent) =>
          new ContinentResponse(
            continent.id,
            continent.name,
            continent.code,
            continent.createdAt,
            continent.updatedAt
          )
      ),
      pagination: result.pagination,
    };
  }
}
