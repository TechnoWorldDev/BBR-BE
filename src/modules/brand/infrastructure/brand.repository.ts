import { Injectable } from '@nestjs/common';
import { applyFilters } from 'src/shared/filters/query.dynamic-filters';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { FetchBrandsQuery } from '../application/command/fetch-brands.query';
import { BrandStatus } from '../domain/brand-status.enum';
import { Brand } from '../domain/brand.entity';
import { IBrandRepository } from '../domain/brand.repository.interface';
import { FetchBrandsPublicQuery } from '../application/command/fetch-brands.public.query';

@Injectable()
export class BrandRepositoryImpl implements IBrandRepository {
  constructor(private readonly knexService: KnexService) {}

  @LogMethod()
  async create(brand: Partial<Brand>): Promise<Brand | undefined> {
    const insertedBrand = await this.knexService.connection('brands').insert(brand).returning('*');

    return this.findById(insertedBrand[0].id);
  }

  @LogMethod()
  async findById(id: string): Promise<Brand | undefined> {
    return await Brand.query()
      .findById(id)
      .whereNull('deleted_at')
      .withGraphFetched('[brandType, logo]');
  }

  @LogMethod()
  async findBySlug(slug: string): Promise<Brand | undefined> {
    return await Brand.query()
      .whereNull('deleted_at')
      .findOne({ slug })
      .withGraphFetched('[brandType, logo]');
  }

  @LogMethod()
  async findByName(name: string): Promise<Brand | undefined> {
    return await Brand.query()
      .where({ name })
      .whereNull('deleted_at')
      .withGraphFetched('logo')
      .first();
  }

  @LogMethod()
  async findAll(
    fetchQuery: FetchBrandsQuery
  ): Promise<{ data: Brand[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery } = fetchQuery;

    let baseQuery = Brand.query()
      .whereNull('deleted_at')
      .modify((qb) =>
        applyFilters(
          qb,
          { status: fetchQuery.status, brandTypeId: fetchQuery.brandTypeId },
          Brand.tableName
        )
      )
      .withGraphFetched('[brandType, logo]');

    // sort
    if (sortBy && sortOrder) {
      const allowedColumns = ['name', 'status', 'registeredAt', 'createdAt', 'updatedAt'];
      if (allowedColumns.includes(sortBy)) {
        baseQuery = baseQuery.orderBy(sortBy, sortOrder);
      }
    }

    // search
    const columnsToSearch = ['brands.name', 'brands.description', 'brands.status'];
    baseQuery = applySearchFilter(baseQuery, searchQuery, columnsToSearch);

    // now paginate
    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      baseQuery,
      page,
      limit
    );

    return {
      data: paginatedQuery,
      pagination: {
        total: totalCount,
        totalPages,
        page,
        limit,
      },
    };
  }

  @LogMethod()
  async findAllPublic(
    fetchQuery: FetchBrandsPublicQuery
  ): Promise<{ data: Brand[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery } = fetchQuery;

    let baseQuery = Brand.query()
      .whereNull('deleted_at')
      .modify((qb) => {
        if (fetchQuery.withResidences) {
          qb.whereExists(function () {
            this.select('*')
              .from('residences')
              .whereRaw('residences.brand_id = brands.id')
              .whereNull('residences.deleted_at');
          });
        }

        applyFilters(
          qb,
          { status: fetchQuery.status, brandTypeId: fetchQuery.brandTypeId },
          Brand.tableName
        );
      })
      .withGraphFetched('[brandType, logo]');

    // sort
    if (sortBy && sortOrder) {
      const allowedColumns = ['name', 'status', 'registeredAt', 'createdAt', 'updatedAt'];
      if (allowedColumns.includes(sortBy)) {
        baseQuery = baseQuery.orderBy(sortBy, sortOrder);
      }
    }

    // search
    const columnsToSearch = ['brands.name', 'brands.description', 'brands.status'];
    baseQuery = applySearchFilter(baseQuery, searchQuery, columnsToSearch);

    // now paginate
    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      baseQuery,
      page,
      limit
    );

    return {
      data: paginatedQuery,
      pagination: {
        total: totalCount,
        totalPages,
        page,
        limit,
      },
    };
  }

  @LogMethod()
  async update(id: string, updateData: Partial<Brand>): Promise<Brand | undefined> {
    const result = await Brand.query().whereNull('deleted_at').patchAndFetchById(id, updateData);

    return this.findById(result.id);
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await Brand.query()
      .where('id', id)
      .patch({ deletedAt: new Date(), status: BrandStatus.DELETED });
  }
}
