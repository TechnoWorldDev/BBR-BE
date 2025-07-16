import { Injectable } from '@nestjs/common';
import { FetchFavoritesQuery } from '../command/fetch-favorites.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Favorite } from '../../domain/favorite.entity';
import { IFavoriteRepository } from '../../domain/favorite.repository.interface';

@Injectable()
export class FetchAllFavoritesQueryHandler {
  constructor(private readonly favoriteRepository: IFavoriteRepository) {}

  async handle(
    userId: string,
    query: FetchFavoritesQuery
  ): Promise<{ data: Favorite[]; pagination: PaginationResponse }> {
    const result = await this.favoriteRepository.findAllByUserId(userId, query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
