import { Injectable } from '@nestjs/common';
import { UnitType } from '../domain/unit_type.entity';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { FetchUnitTypeQuery } from '../application/commands/fetch-unit-type.query';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { IUnitTypeRepository } from '../domain/unit-type.repository.interface';

@Injectable()
export class UnitTypeRepositoryImpl implements IUnitTypeRepository {
  constructor() {}

  async findAll(
    fetchQuery: FetchUnitTypeQuery
  ): Promise<{ data: UnitType[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery: searchQuery } = fetchQuery;

    let query = UnitType.query().whereNull('deletedAt');

    if (sortBy && sortOrder) {
      const allowedColumns = ['name', 'createdAt', 'updatedAt'];
      if (allowedColumns.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const columnsToSearch = ['unit_types.name'];
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

  async findByName(name: string): Promise<UnitType | undefined> {
    return await UnitType.query().findOne({ name }).whereNull('deletedAt');
  }

  async findById(id: string): Promise<UnitType | undefined> {
    return await UnitType.query().findById(id).whereNull('deletedAt');
  }

  async create(unitType: Partial<UnitType>): Promise<UnitType> {
    return await UnitType.create(unitType);
  }

  async update(id: string, data: Partial<UnitType>): Promise<UnitType> {
    return await UnitType.query().patchAndFetchById(id, data);
  }

  async delete(id: string): Promise<void> {
    await UnitType.query().patch({ deletedAt: new Date() }).where('id', id);
  }
}
