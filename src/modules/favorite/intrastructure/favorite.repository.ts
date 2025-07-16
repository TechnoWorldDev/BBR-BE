import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchFavoritesQuery } from '../application/command/fetch-favorites.query';
import { Favorite } from '../domain/favorite.entity';
import { IFavoriteRepository } from '../domain/favorite.repository.interface';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { Injectable } from '@nestjs/common';
import { Residence } from '../domain/residence.entity';
import { Unit } from '../domain/unit.entity';
import { FavoriteTypeEnum } from 'src/shared/types/favorite-type.enum';

@Injectable()
export class FavoriteRepositoryImpl implements IFavoriteRepository {
  constructor(private readonly knexService: KnexService) {}

  async findAllByUserId(
    userId: string,
    fetchQuery: FetchFavoritesQuery
  ): Promise<{ data: Favorite[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery, entityType } = fetchQuery;

    // 1. Fetch favorites paginated
    let query = Favorite.query().where({ userId });

    if (sortBy && sortOrder) {
      const allowedColumns = ['createdAt', 'updatedAt', 'entityType'];
      if (allowedColumns.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    if (entityType) {
      const entityTypeArray = Array.isArray(entityType) ? entityType : [entityType];
      query = query.whereIn('entityType', entityTypeArray);
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(query, page, limit);

    // 2. Grupuj po entityType
    const grouped = new Map<string, string[]>();

    for (const fav of paginatedQuery) {
      if (!grouped.has(fav.entityType)) grouped.set(fav.entityType, []);
      grouped.get(fav.entityType)!.push(fav.entityId);
    }

    // 3. Fetchuj entitete po tipu
    const resolvedEntities = new Map<string, Map<string, any>>();

    for (const [type, ids] of grouped.entries()) {
      let rows: any[] = [];

      if (type === FavoriteTypeEnum.RESIDENCES) {
        rows = await Residence.query().whereIn('id', ids).withGraphFetched('featuredImage');
      } else if (type === FavoriteTypeEnum.UNITS) {
        rows = await Unit.query().whereIn('id', ids).withGraphFetched('featureImage');
      } else {
        rows = await this.knexService.connection(type).whereIn('id', ids).select('*');
      }

      resolvedEntities.set(type, new Map(rows.map((e) => [e.id, e])));
    }

    // 4. Spoji favorite sa entitetima
    const enriched = paginatedQuery.map((fav) => {
      const entity = resolvedEntities.get(fav.entityType)?.get(fav.entityId) ?? null;
      return {
        ...fav,
        entity,
      };
    });

    // 5. Filtracija po `entity.name` ako postoji search query
    const filtered = searchQuery
      ? enriched.filter((f) => f.entity?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      : enriched;

    return {
      data: filtered,
      pagination: {
        total: totalCount,
        totalPages,
        page,
        limit,
      },
    };
  }

  async findByUserIdAndEntityId(
    userId: string,
    entityType: string,
    entityId: string
  ): Promise<Favorite | undefined> {
    return await Favorite.query().findOne({ userId, entityType, entityId });
  }

  async add(userId: string, data: Partial<Favorite>): Promise<Favorite> {
    const { entityType, entityId } = data;
    return await Favorite.query().insertAndFetch({
      userId,
      entityType,
      entityId,
    });
  }

  async remove(userId: string, data: Partial<Favorite>): Promise<number> {
    const { entityId, entityType } = data;
    return await Favorite.query().delete().where({ userId, entityId, entityType });
  }
}
