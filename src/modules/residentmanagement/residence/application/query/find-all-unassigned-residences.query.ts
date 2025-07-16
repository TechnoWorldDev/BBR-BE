import { Injectable, NotFoundException } from '@nestjs/common';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { FetchResidencesUnassignedToCategoryQuery } from '../commands/fetch-residences-unassigned-to-category.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Residence } from '../../domain/residence.entity';
import { IRankingCategoryRepository } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category.repository.interface';

@Injectable()
export class FindAllUnassignedResidencesCommandQuery {
  constructor(
    private readonly residenceRepository: IResidenceRepository,
    private readonly rankingCategoryRepository: IRankingCategoryRepository
  ) {}

  async handle(
    rankingCategoryId: string,
    query: FetchResidencesUnassignedToCategoryQuery
  ): Promise<{ data: Residence[]; pagination: PaginationResponse }> {
    const rankingCategory = await this.rankingCategoryRepository.findById(rankingCategoryId);

    if (!rankingCategory) {
      throw new NotFoundException('Ranking category not found');
    }

    return await this.residenceRepository.findAllUnassignedToCategory(rankingCategory.id, query);
  }
}
