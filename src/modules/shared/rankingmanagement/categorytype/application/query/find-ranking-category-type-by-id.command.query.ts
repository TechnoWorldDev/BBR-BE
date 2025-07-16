import { Injectable, NotFoundException } from '@nestjs/common';
import { RankingCategoryType } from '../../domain/ranking-category-type.entity';
import { IRankingCategoryTypeRepository } from '../../domain/ranking-category-type.repository.interface';
import { LogMethod } from '../../../../../../shared/infrastructure/logger/log.decorator';

@Injectable()
export class FindRankingCategoryTypeByIdCommandQuery {
  constructor(private readonly rankingCategoryTypeRepository: IRankingCategoryTypeRepository) {}

  @LogMethod()
  async handle(id: string): Promise<RankingCategoryType> {
    const rankingCategoryType = await this.rankingCategoryTypeRepository.findById(id);
    if (!rankingCategoryType) throw new NotFoundException('Ranking Category Type not found');
    return rankingCategoryType;
  }
}
