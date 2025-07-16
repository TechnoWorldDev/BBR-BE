import { Injectable, NotFoundException } from '@nestjs/common';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';
import { FetchResidencesByCategoryQuery } from '../command/fetch-residences-by-category.query';

@Injectable()
export class FetchResidencesByCategoryCommandQuery {
  constructor(private readonly rankingCategoryRespository: IRankingCategoryRepository) {}

  async handle(slug: string, query: FetchResidencesByCategoryQuery): Promise<any> {
    const isCategoryExist = await this.rankingCategoryRespository.findBySlug(slug);

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
