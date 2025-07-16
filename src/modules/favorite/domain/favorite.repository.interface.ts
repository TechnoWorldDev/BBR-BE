import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchFavoritesQuery } from '../application/command/fetch-favorites.query';
import { Favorite } from './favorite.entity';

export abstract class IFavoriteRepository {
  abstract findAllByUserId(
    userId: string,
    query: FetchFavoritesQuery
  ): Promise<{ data: Favorite[]; pagination: PaginationResponse }>;
  abstract findByUserIdAndEntityId(
    userId: string,
    entityType: string,
    entityId: string
  ): Promise<Favorite | undefined>;
  abstract add(userId: string, data: Partial<Favorite>): Promise<Favorite>;
  abstract remove(userId: string, data: Partial<Favorite>): Promise<number>;
}
