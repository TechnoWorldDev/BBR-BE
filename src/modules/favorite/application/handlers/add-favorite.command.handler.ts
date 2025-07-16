import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Favorite } from '../../domain/favorite.entity';
import { IFavoriteRepository } from '../../domain/favorite.repository.interface';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { AddFavoriteCommand } from '../command/add-favorite.command';
import { IUnitRepository } from '../../domain/unit.repository.interface';
import { FavoriteTypeEnum } from 'src/shared/types/favorite-type.enum';

@Injectable()
export class AddFavoriteCommandHandler {
  constructor(
    private readonly favoriteRepository: IFavoriteRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly unitRepository: IUnitRepository
  ) {}

  async handle(userId: string, command: AddFavoriteCommand): Promise<Favorite> {
    if (command.entityType === FavoriteTypeEnum.RESIDENCES) {
      const residence = await this.residenceRepository.findById(command.entityId);

      if (!residence) {
        throw new NotFoundException('Residence not found');
      }
    }

    if (command.entityType === FavoriteTypeEnum.UNITS) {
      const unit = await this.unitRepository.findById(command.entityId);

      if (!unit) {
        throw new NotFoundException('Unit not found');
      }
    }

    const ifFavouriteExists = await this.favoriteRepository.findByUserIdAndEntityId(
      userId,
      command.entityType,
      command.entityId
    );

    if (ifFavouriteExists) {
      throw new ConflictException('Already added to favorites');
    }

    return await this.favoriteRepository.add(userId, command);
  }
}
