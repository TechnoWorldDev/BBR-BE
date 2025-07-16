import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { Injectable } from '@nestjs/common';
import { IBrandTypesRepository } from '../../domain/brand-type.repository.interface';
import { BrandType } from '../../domain/brand-type.entity';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchBrandTypesQuery } from '../command/fetch-brand-types.query';

@Injectable()
export class FetchAllBrandTypesQueryHandler {
  constructor(private readonly brandTypesRepository: IBrandTypesRepository) {}

  @LogMethod()
  async handle(
    query: FetchBrandTypesQuery
  ): Promise<{ data: BrandType[]; pagination: PaginationResponse }> {
    const brandTypes = await this.brandTypesRepository.findAll(query);

    return brandTypes;
  }
}
