import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RemoveFavoriteCommand } from '../command/remove-favorite.command';
import { IFavoriteRepository } from '../../domain/favorite.repository.interface';

@Injectable()
export class RemoveFavoriteCommandHandler {
  constructor(private readonly favoriteRepository: IFavoriteRepository) {}

  async handle(userId: string, command: RemoveFavoriteCommand): Promise<void> {
    const ifFavouriteExists = await this.favoriteRepository.findByUserIdAndEntityId(
      userId,
      command.entityType,
      command.entityId
    );

    if (!ifFavouriteExists) {
      throw new NotFoundException('Favorite not found');
    }

    const result = await this.favoriteRepository.remove(userId, command);

    if (!result) {
      throw new InternalServerErrorException('Favorite could not be removed');
    }
  }
}
