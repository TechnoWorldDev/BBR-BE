import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRankingCategoryCommand } from '../../../category/application/command/update-ranking-category.command';
import { IRankingCriteriaRepository } from '../../domain/ranking-criteria.repository.interface';
import { UpdateRankingCriteriaCommand } from '../commands/update-ranking-criteria.command';

@Injectable()
export class UpdateRankingCriteriaCommandHandler {
  constructor(private readonly rankingCriteriaRepository: IRankingCriteriaRepository) {}

  async handle(id: string, command: UpdateRankingCriteriaCommand) {
    const { name, description, isDefault } = command;

    const existingCriteria = await this.rankingCriteriaRepository.findById(id);

    if (!existingCriteria) {
      throw new NotFoundException('Criteria not found');
    }

    const criteria = await this.rankingCriteriaRepository.update(id, {
      name,
      description,
      isDefault,
    });

    if (!criteria) {
      throw new NotFoundException('Criteria not found');
    }

    return criteria;
  }
}
