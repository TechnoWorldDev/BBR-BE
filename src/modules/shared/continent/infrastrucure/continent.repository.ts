import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { IContinentRepository } from '../domain/continent.repository.interface';
import { Continent } from '../domain/continent.entity';
import { FetchContinentsQuery } from '../application/command/fetch-continents.query';
import { applyPagination } from '../../../../shared/utils/pagination.util';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { KnexService } from '../../../../shared/infrastructure/database/knex.service';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { ResidenceStatusEnum } from 'src/modules/residentmanagement/residence/domain/residence-status.enum';

export class ContinentRepositoryImpl implements IContinentRepository {
  constructor(private readonly knexService: KnexService) {}
  @LogMethod()
  async findById(id: string): Promise<Continent | undefined> {
    return Continent.query().findById(id).whereNull('deleted_at');
  }

  @LogMethod()
  async findByCode(code: string): Promise<Continent | undefined> {
    return Continent.query().where('code', code).whereNull('deleted_at').first();
  }

  @LogMethod()
  async findAll(
    fetchQuery: FetchContinentsQuery
  ): Promise<{ data: Continent[]; pagination: PaginationResponse }> {
    const { page, limit, searchQuery: searchQuery } = fetchQuery;
    let query = Continent.query().whereNull('deleted_at');

    const columnsToSearch = ['continents.name', 'continents.code'];
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
  async findAllPublic(
    fetchQuery: FetchContinentsQuery
  ): Promise<{ data: Continent[]; pagination: PaginationResponse }> {
    const { page, limit, searchQuery: searchQuery } = fetchQuery;

    let query = Continent.query().whereExists(function () {
      this.select('*')
        .from('residences')
        .join('countries', 'residences.country_id', 'countries.id')
        .whereRaw('countries.continent_id = continents.id')
        .where('residences.status', ResidenceStatusEnum.ACTIVE)
        .whereNull('residences.deleted_at');
    });

    const columnsToSearch = ['continents.name', 'continents.code'];

    query = applySearchFilter(query.clone(), searchQuery, columnsToSearch);

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
  async create(data: Partial<Continent>): Promise<Continent> {
    return Continent.query().insert(data).returning('*');
  }

  @LogMethod()
  async update(id: string, data: Partial<Continent>): Promise<Continent | undefined> {
    return Continent.query().patchAndFetchById(id, data);
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await Continent.query().patch({ deletedAt: new Date() }).where('id', id);
  }
}
