import { Injectable } from '@nestjs/common';
import { ILifestyleRepository } from '../domain/lifestyle.repository.interface';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { Lifestyle } from '../domain/lifestyle.entity';
import { FetchLifestyleQuery } from '../application/command/fetch-lifestyle.query';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';

@Injectable()
export class LifestyleRepositoryIml implements ILifestyleRepository {
  constructor(private readonly knexService: KnexService) {}

  async findAll(
    fetchQuery: FetchLifestyleQuery
  ): Promise<{ data: Lifestyle[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery: searchQuery } = fetchQuery;

    let query = Lifestyle.query();

    if (sortBy && sortOrder) {
      const allowedColumns = ['name', 'createdAt', 'updatedAt'];
      if (allowedColumns.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const columnsToSearch = ['lifestyles.name'];
    query = applySearchFilter(query, searchQuery, columnsToSearch);

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

  async findById(id: string): Promise<Lifestyle | undefined> {
    return await Lifestyle.query().findById(id);
  }

  async findByName(name: string): Promise<Lifestyle | undefined> {
    return await Lifestyle.query().findOne({ name });
  }

  async create(lifestyle: Partial<Lifestyle>): Promise<Lifestyle> {
    return await Lifestyle.create(lifestyle);
  }

  async update(id: string, data: Partial<Lifestyle>): Promise<Lifestyle | undefined> {
    return await Lifestyle.query().patchAndFetchById(id, data);
  }

  async delete(id: string): Promise<any> {
    return await Lifestyle.query().deleteById(id);
  }
}
