import { Injectable } from '@nestjs/common';
import { City } from '../domain/city.entity';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { applyPagination } from '../../../../shared/utils/pagination.util';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { ICityRepository } from '../domain/city.repository.interface';
import { FetchCitiesQuery } from '../application/commands/fetch-cities.query';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { applyFilters } from 'src/shared/filters/query.dynamic-filters';
import { ResidenceStatusEnum } from 'src/modules/residentmanagement/residence/domain/residence-status.enum';

@Injectable()
export class CityRepositoryImpl implements ICityRepository {
  constructor(private readonly knexService: KnexService) {}

  @LogMethod()
  async create(city: Partial<City>): Promise<City | undefined> {
    const cityData = {
      name: city.name,
      asciiName: city.asciiName,
      countryId: city.country?.id,
      population: city.population,
      timezone: city.timezone,
      xCoordinate: city.xCoordinate,
      yCoordinate: city.yCoordinate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const insertedCity = await knex('cities').insert(cityData).returning('*');

    return this.findById(insertedCity[0].id);
  }

  @LogMethod()
  async findById(id: string): Promise<City | undefined> {
    return City.query().findById(id).whereNull('deleted_at').withGraphFetched('[country]'); // Assuming "country" is a relation to be fetched
  }

  @LogMethod()
  async findAll(
    fetchQuery: FetchCitiesQuery
  ): Promise<{ data: City[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery: searchQuery, countryId } = fetchQuery;

    let query = City.query()
      .modify((qb) => applyFilters(qb, { countryId }, City.tableName))
      .whereNull('deleted_at')
      .withGraphFetched('[country]'); // Assuming "country" is a relation to be fetched

    const columnsToSearch = [
      'cities.name',
      'cities.ascii_name',
      'cities.population',
      'cities.x_coordinate',
      'cities.y_coordinate',
    ];
    const columnsToSort = [
      'name',
      'asciiName',
      'population',
      'timezone',
      'xCoordinate',
      'yCoordinate',
    ];
    query = applySearchFilter(query, searchQuery, columnsToSearch);

    if (sortBy && sortOrder) {
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
        page,
        limit,
      },
    };
  }

  @LogMethod()
  async findAllPublic(
    fetchQuery: FetchCitiesQuery
  ): Promise<{ data: City[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery: searchQuery, countryId } = fetchQuery;

    let query = City.query()
      .modify((qb) => applyFilters(qb, { countryId }, City.tableName))
      .whereExists(function () {
        this.select('*')
          .from('residences')
          .whereRaw('residences.city_id = cities.id')
          .where('residences.status', ResidenceStatusEnum.ACTIVE)
          .whereNull('residences.deleted_at');
      })
      .withGraphFetched('[country]'); // Assuming "country" is a relation to be fetched

    const columnsToSearch = [
      'cities.name',
      'cities.ascii_name',
      'cities.population',
      'cities.x_coordinate',
      'cities.y_coordinate',
    ];
    const columnsToSort = [
      'name',
      'asciiName',
      'population',
      'timezone',
      'xCoordinate',
      'yCoordinate',
    ];
    query = applySearchFilter(query, searchQuery, columnsToSearch);

    if (sortBy && sortOrder) {
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
        page,
        limit,
      },
    };
  }

  @LogMethod()
  async findByName(name: string): Promise<City | undefined> {
    return City.query().findOne({ name }).whereNull('deleted_at');
  }

  @LogMethod()
  async update(id: string, data: Partial<City>): Promise<City | undefined> {
    return City.query().patchAndFetchById(id, data).whereNull('deleted_at');
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await City.query().deleteById(id);
  }
}
