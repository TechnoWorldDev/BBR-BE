import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { IRankingCriteriaRepository } from '../domain/ranking-criteria.repository.interface';
import { RankingCriteria } from '../domain/ranking-criteria.entity';
import { FetchRankingCriteriaQuery } from '../application/commands/fetch-ranking-criteria.query';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RankingCriteriaRepositoryImpl implements IRankingCriteriaRepository {
  constructor(private readonly knexService: KnexService) {}

  async findAll(
    query: FetchRankingCriteriaQuery
  ): Promise<{ data: RankingCriteria[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery } = query;

    let criteriaQuery = RankingCriteria.query();

    const columnsToSearchAndSort = ['name', 'description'];
    criteriaQuery = applySearchFilter(criteriaQuery, searchQuery, columnsToSearchAndSort);

    if (sortBy && sortOrder) {
      if (columnsToSearchAndSort.includes(sortBy)) {
        criteriaQuery = criteriaQuery.orderBy(sortBy, sortOrder);
      }
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      criteriaQuery,
      page,
      limit
    );

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

  async findById(id: string): Promise<RankingCriteria | undefined> {
    return RankingCriteria.query().findById(id);
  }

  async findByName(name: string): Promise<RankingCriteria | undefined> {
    return RankingCriteria.query().findOne({ name });
  }

  async create(data: RankingCriteria): Promise<RankingCriteria | undefined> {
    return RankingCriteria.query().insert(data);
  }

  async update(id: string, data: any): Promise<RankingCriteria | undefined> {
    return RankingCriteria.query().patchAndFetchById(id, data);
  }

  async delete(id: string): Promise<void> {
    await RankingCriteria.query().deleteById(id);
  }

  async findByIds(ids: string[]): Promise<RankingCriteria[]> {
    if (!ids.length) return [];
    return await RankingCriteria.query().whereIn('id', ids);
  }

  async findAllByResidenceAndCategory(
    residenceId: string,
    categoryId: string
  ): Promise<RankingCriteria[]> {
    const knex = this.knexService.connection;

    const rows = await knex('ranking_category_criteria as rcc')
      .select(['rc.id', 'rc.name', 'rc.description', 'rc.is_default', 'rcc.weight', 'rrcs.score'])
      .join('ranking_criteria as rc', 'rc.id', 'rcc.ranking_criteria_id')
      .leftJoin('residence_ranking_criteria_scores as rrcs', function () {
        this.on('rrcs.ranking_criteria_id', '=', 'rc.id').andOn(
          'rrcs.residence_id',
          '=',
          knex.raw('?', [residenceId])
        );
      })
      .where('rcc.ranking_category_id', categoryId)
      .orderBy('rc.name', 'asc');

    return rows;
  }
}
