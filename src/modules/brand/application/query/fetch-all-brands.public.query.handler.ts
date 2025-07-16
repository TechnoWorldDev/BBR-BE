import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Brand } from '../../domain/brand.entity';
import { IBrandRepository } from '../../domain/brand.repository.interface';
import { FetchBrandsPublicQuery } from '../command/fetch-brands.public.query';

@Injectable()
export class FetchAllBrandPublicQueryHandler {
  constructor(private readonly brandRepository: IBrandRepository) {}

  @LogMethod()
  async handle(
    query: FetchBrandsPublicQuery
  ): Promise<{ data: Brand[]; pagination: PaginationResponse }> {
    const result = await this.brandRepository.findAllPublic(query);
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
