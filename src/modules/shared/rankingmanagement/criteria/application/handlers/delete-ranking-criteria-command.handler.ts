import { Injectable } from '@nestjs/common';
import { IRankingCriteriaRepository } from '../../domain/ranking-criteria.repository.interface';

@Injectable()
export class DeleteRankingCriteriaCommandHandler {
  constructor(private readonly rankingCriteriaRepository: IRankingCriteriaRepository) {}

  async handle(id: string): Promise<void> {
    await this.rankingCriteriaRepository.delete(id);
  }
}
