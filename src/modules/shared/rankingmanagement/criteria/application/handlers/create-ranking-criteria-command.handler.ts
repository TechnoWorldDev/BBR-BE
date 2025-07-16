import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RankingCriteria } from '../../domain/ranking-criteria.entity';
import { CreateRankingCriteriaCommand } from '../commands/create-ranking-criteria.command';
import { IRankingCriteriaRepository } from '../../domain/ranking-criteria.repository.interface';

@Injectable()
export class CreateRankingCriteriaCommandHandler {
  constructor(private readonly rankingCriteriaRepository: IRankingCriteriaRepository) {}

  async handle(command: CreateRankingCriteriaCommand): Promise<RankingCriteria> {
    const { name, description, isDefault } = command;

    const existingCriteria = await this.rankingCriteriaRepository.findByName(name);

    if (existingCriteria) {
      throw new ConflictException('Criteria already exists');
    }

    const criteria = await this.rankingCriteriaRepository.create(command);

    if (!criteria) {
      throw new InternalServerErrorException('Failed to create criteria');
    }

    return criteria;
  }
}
