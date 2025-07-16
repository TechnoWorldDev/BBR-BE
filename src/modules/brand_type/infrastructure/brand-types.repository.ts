import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { KnexService } from '../../../shared/infrastructure/database/knex.service';
import { FetchBrandTypesQuery } from '../application/command/fetch-brand-types.query';
import { BrandType } from '../domain/brand-type.entity';
import { IBrandTypesRepository } from '../domain/brand-type.repository.interface';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';

@Injectable()
export class BrandTypesRepository implements IBrandTypesRepository {
  constructor(private readonly knexService: KnexService) {}
  @LogMethod()
  async findAll(
    fetchQuery: FetchBrandTypesQuery
  ): Promise<{ data: BrandType[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery: searchQuery } = fetchQuery;

    let query = BrandType.query().withGraphFetched('brands.[logo]');

    if (sortBy && sortOrder) {
      const allowedColumns = ['name', 'createdAt', 'updatedAt'];
      if (allowedColumns.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const columnsToSearch = ['brand_types.name', 'brand_types.description'];
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

  @LogMethod()
  async create(brandType: Partial<BrandType>): Promise<BrandType> {
    return await BrandType.query().insert(brandType).returning('*');
  }

  @LogMethod()
  async findByName(name: string): Promise<BrandType | undefined> {
    return await BrandType.query().where({ name }).first();
  }

  @LogMethod()
  async findById(id: string): Promise<BrandType | undefined> {
    return await BrandType.query().findById(id).withGraphFetched('brands.[logo]');
  }

  @LogMethod()
  async update(id: string, brandType: Partial<BrandType>): Promise<BrandType> {
    return await BrandType.query().patchAndFetchById(id, brandType);
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await BrandType.query().deleteById(id);
  }
}
