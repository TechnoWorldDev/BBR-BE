import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RankingCategoryType } from '../../domain/ranking-category-type.entity';
import { IRankingCategoryTypeRepository } from '../../domain/ranking-category-type.repository.interface';
import { UpdateRankingCategoryTypeCommand } from '../command/update-ranking-category-type.command';
import { LogMethod } from '../../../../../../shared/infrastructure/logger/log.decorator';

@Injectable()
export class UpdateRankingCategoryTypeCommandHandler {
  constructor(private readonly rankingCategoryTypeRepository: IRankingCategoryTypeRepository) {}

  @LogMethod()
  async handle(command: UpdateRankingCategoryTypeCommand): Promise<RankingCategoryType> {
    const existingCategoryType = await this.rankingCategoryTypeRepository.findById(command.id);
    if (!existingCategoryType) {
      throw new NotFoundException('Ranking Category Type not found');
    }

    const existingCategoryTypeByName = await this.rankingCategoryTypeRepository.findByName(
      command.name
    );
    if (existingCategoryTypeByName && existingCategoryTypeByName.id !== command.id) {
      throw new ConflictException('Ranking Category Type with this name already exists');
    }

    const updatedCategoryType = await this.rankingCategoryTypeRepository.update(command.id, {
      name: command.name,
    });

    if (!updatedCategoryType) {
      throw new InternalServerErrorException('Ranking Category Type not updated');
    }

    return updatedCategoryType;
  }
}
