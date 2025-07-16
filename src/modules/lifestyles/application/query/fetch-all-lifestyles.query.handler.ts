import { Injectable } from '@nestjs/common';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Lifestyle } from '../../domain/lifestyle.entity';
import { ILifestyleRepository } from '../../domain/lifestyle.repository.interface';
import { FetchLifestyleQuery } from '../command/fetch-lifestyle.query';

@Injectable()
export class FetchAllLifestylesQueryHandler {
  constructor(private readonly lifestyleRepository: ILifestyleRepository) {}

  async handle(
    query: FetchLifestyleQuery
  ): Promise<{ data: Lifestyle[]; pagination: PaginationResponse }> {
    const result = await this.lifestyleRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
