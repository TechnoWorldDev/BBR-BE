import { Injectable } from '@nestjs/common';
import { RankingCategoryType } from '../domain/ranking-category-type.entity';
import { IRankingCategoryTypeRepository } from '../domain/ranking-category-type.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { FetchRankingCategoryTypesQuery } from '../application/command/fetch-ranking-category-type.query';
import { PaginationResponse } from '../../../../../shared/ui/response/pagination.response';
import { applyPagination } from '../../../../../shared/utils/pagination.util';
import { Amenity } from '../../../../residentmanagement/amenity/domain/amenity.entity';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { applyFilters } from 'src/shared/filters/query.dynamic-filters';

@Injectable()
export class RankingCategoryTypeRepositoryImpl implements IRankingCategoryTypeRepository {
  constructor(private readonly knexService: KnexService) {}

  @LogMethod()
  async create(category: Partial<RankingCategoryType>): Promise<RankingCategoryType | undefined> {
    const categoryData = {
      name: category.name,
      key: category.key,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const insertedCategory = await knex('ranking_category_types')
      .insert(categoryData)
      .returning('*');

    return this.findById(insertedCategory[0].id);
  }

  @LogMethod()
  async findById(id: string): Promise<RankingCategoryType | undefined> {
    return RankingCategoryType.query().findById(id).whereNull('deleted_at');
  }

  @LogMethod()
  async findAll(
    fetchQuery: FetchRankingCategoryTypesQuery
  ): Promise<{ data: RankingCategoryType[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery } = fetchQuery;

    let query = RankingCategoryType.query().whereNull('deleted_at');

    const columnsToSearch = ['ranking_category_types.name'];
    query = applySearchFilter(query, searchQuery, columnsToSearch);

    if (sortBy && sortOrder) {
      const columnsToSort = ['name', 'created_at', 'updated_at'];
      if (columnsToSort.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(query, page, limit);

    return {
      data: paginatedQuery,
      pagination: {
        total: totalCount,
        totalPages,
        page: page,
        limit: limit,
      },
    };
  }

  @LogMethod()
  async findByName(name: string): Promise<RankingCategoryType | undefined> {
    return RankingCategoryType.query().findOne({ name }).whereNull('deleted_at');
  }

  @LogMethod()
  async update(
    id: string,
    data: Partial<RankingCategoryType>
  ): Promise<RankingCategoryType | undefined> {
    return RankingCategoryType.query().patchAndFetchById(id, data).whereNull('deleted_at');
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await RankingCategoryType.query().where('id', id).patch({ deletedAt: new Date() });
  }
}
