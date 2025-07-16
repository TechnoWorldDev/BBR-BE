import { Injectable, NotFoundException } from '@nestjs/common';
import { IRankingCategoryTypeRepository } from '../../domain/ranking-category-type.repository.interface';
import { LogMethod } from '../../../../../../shared/infrastructure/logger/log.decorator';

@Injectable()
export class DeleteRankingCategoryTypeCommandHandler {
  constructor(private readonly rankingCategoryTypeRepository: IRankingCategoryTypeRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const categoryType = await this.rankingCategoryTypeRepository.findById(id);
    if (!categoryType) throw new NotFoundException('Ranking Category Type not found');

    await this.rankingCategoryTypeRepository.delete(id);
  }
}
