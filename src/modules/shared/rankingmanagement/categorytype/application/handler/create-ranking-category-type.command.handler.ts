import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RankingCategoryType } from '../../domain/ranking-category-type.entity';
import { IRankingCategoryTypeRepository } from '../../domain/ranking-category-type.repository.interface';
import { LogMethod } from '../../../../../../shared/infrastructure/logger/log.decorator';
import { CreateRankingCategoryTypeCommand } from '../command/create-ranking-category-type.command';

@Injectable()
export class CreateRankingCategoryTypeCommandHandler {
  constructor(private readonly rankingCategoryTypeRepository: IRankingCategoryTypeRepository) {}

  @LogMethod()
  async handle(command: CreateRankingCategoryTypeCommand): Promise<RankingCategoryType> {
    const existingCategory = await this.rankingCategoryTypeRepository.findByName(command.name);
    if (existingCategory) {
      throw new ConflictException('Ranking Category Type with this name already exists');
    }

    const result = await this.rankingCategoryTypeRepository.create({
      name: command.name,
      key: command.key,
    });

    if (!result) {
      throw new InternalServerErrorException('Ranking Category Type not saved');
    }

    return result;
  }
}
