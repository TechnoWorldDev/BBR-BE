import { Injectable, NotFoundException } from '@nestjs/common';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class DeleteRankingCategoryCommandHandler {
  constructor(private readonly rankingCategoryRepository: IRankingCategoryRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const rankingCategory = await this.rankingCategoryRepository.findById(id);
    if (!rankingCategory) throw new NotFoundException('Ranking Category not found');

    await this.rankingCategoryRepository.softDelete(id);
  }
}
