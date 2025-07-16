import { ConflictException, Injectable } from '@nestjs/common';
import { IKeyFeatureRepository } from '../domain/key-feature.repository.interface';
import { KeyFeature } from '../domain/key-feature.entity';
import { FetchKeyFeaturesQuery } from '../application/commands/fetch-key-features.query';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';

@Injectable()
export class KeyFeatureRepository implements IKeyFeatureRepository {
  constructor() {}

  @LogMethod()
  async create(keyFeature: Partial<KeyFeature>): Promise<KeyFeature> {
    return await KeyFeature.create(keyFeature);
  }

  @LogMethod()
  async update(id: string, data: Partial<KeyFeature>): Promise<KeyFeature> {
    return await KeyFeature.query().patchAndFetchById(id, data);
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await KeyFeature.query().deleteById(id);
  }

  @LogMethod()
  async findById(id: string): Promise<KeyFeature | undefined> {
    return await KeyFeature.query().findById(id);
  }

  @LogMethod()
  async findByName(name: string): Promise<KeyFeature | undefined> {
    return await KeyFeature.query().findOne({ name });
  }

  @LogMethod()
  async findAll(
    fetchQuery: FetchKeyFeaturesQuery
  ): Promise<{ data: KeyFeature[]; pagination: any }> {
    const { page, limit, sortBy, sortOrder, searchQuery: searchQuery } = fetchQuery;

    let query = KeyFeature.query();

    if (sortBy && sortOrder) {
      const allowedColumns = ['name', 'createdAt', 'updatedAt'];
      if (allowedColumns.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const columnsToSearch = ['key_features.name'];
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
  async validateAndFetchByIds(ids: string[]): Promise<KeyFeature[]> {
    const keyFeatures = await KeyFeature.query().findByIds(ids);
    if (ids.length !== keyFeatures.length) {
      throw new ConflictException('Some key features not found');
    }
    return keyFeatures;
  }
}
