import { Injectable, NotFoundException } from '@nestjs/common';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';
import { FetchResidencesByCategoryQuery } from '../command/fetch-residences-by-category.query';

@Injectable()
export class FetchResidencesByCategoryIdCommandQuery {
  constructor(private readonly rankingCategoryRespository: IRankingCategoryRepository) {}

  async handle(id: string, query: FetchResidencesByCategoryQuery): Promise<any> {
    const isCategoryExist = await this.rankingCategoryRespository.findById(id);

    if (!isCategoryExist) {
      throw new NotFoundException('Ranking category not found');
    }

    const result = await this.rankingCategoryRespository.findResidencesByCategory(
      isCategoryExist.id,
      query
    );

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
