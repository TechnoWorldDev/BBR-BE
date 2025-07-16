import { Injectable } from '@nestjs/common';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Residence } from '../../domain/residence.entity';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { FetchResidencesQuery } from '../commands/fetch-residences.query';

@Injectable()
export class FindAllResidencesCommandQuery {
  constructor(private readonly residenceRepository: IResidenceRepository) {}

  async handle(
    query: FetchResidencesQuery
  ): Promise<{ data: Residence[]; pagination: PaginationResponse }> {
    const result = await this.residenceRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
