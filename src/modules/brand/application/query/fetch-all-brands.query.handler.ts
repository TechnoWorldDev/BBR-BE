import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Brand } from '../../domain/brand.entity';
import { IBrandRepository } from '../../domain/brand.repository.interface';
import { FetchBrandsQuery } from '../command/fetch-brands.query';

@Injectable()
export class FetchAllBrandQueryHandler {
  constructor(private readonly brandRepository: IBrandRepository) {}

  @LogMethod()
  async handle(
    query: FetchBrandsQuery
  ): Promise<{ data: Brand[]; pagination: PaginationResponse }> {
    const result = await this.brandRepository.findAll(query);
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
