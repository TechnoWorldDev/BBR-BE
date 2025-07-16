import { Injectable } from '@nestjs/common';
import { IUnitTypeRepository } from '../../domain/unit-type.repository.interface';
import { FetchUnitTypeQuery } from '../commands/fetch-unit-type.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { UnitType } from '../../domain/unit_type.entity';

@Injectable()
export class FetchUnitTypesQueryHandler {
  constructor(private readonly unitTypeRepository: IUnitTypeRepository) {}

  async handle(
    query: FetchUnitTypeQuery
  ): Promise<{ data: UnitType[]; pagination: PaginationResponse }> {
    const result = await this.unitTypeRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
