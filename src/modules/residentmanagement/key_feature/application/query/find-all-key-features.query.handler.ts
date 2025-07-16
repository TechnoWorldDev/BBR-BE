import { Injectable } from '@nestjs/common';
import { FetchKeyFeaturesQuery } from '../commands/fetch-key-features.query';
import { KeyFeature } from '../../domain/key-feature.entity';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { IKeyFeatureRepository } from '../../domain/key-feature.repository.interface';

@Injectable()
export class FindAllKeyFeaturesQueryHandler {
  constructor(private readonly keyFeatureRepository: IKeyFeatureRepository) {}

  async handle(
    query: FetchKeyFeaturesQuery
  ): Promise<{ data: KeyFeature[]; pagination: PaginationResponse }> {
    const result = await this.keyFeatureRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
