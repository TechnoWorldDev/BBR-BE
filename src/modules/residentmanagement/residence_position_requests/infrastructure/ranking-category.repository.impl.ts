import { Injectable } from '@nestjs/common';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { RankingCategory } from '../domain/ranking-category.entity';
import { IRankingCategoryRepository } from '../domain/ranking-category.repository.interface';

@Injectable()
export class RankingCategoryRepositoryImpl implements IRankingCategoryRepository {
  constructor(private readonly knexService: KnexService) {}

  async findById(id: string): Promise<RankingCategory | undefined> {
    const category = await RankingCategory.query().findById(id).whereNull('deletedAt');

    if (!category) return;

    return category;
  }
}
