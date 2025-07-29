import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchPositionRequestsQuery } from '../application/command/fetch-position-requests.query';
import { ResidencePositionRequest } from '../domain/residence-position-requests.entity';
import { IResidencePositionRequestsRepository } from '../domain/residence-position-requests.repository.interface';
import { applyFilters } from 'src/shared/filters/query.dynamic-filters';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { ResidencePositionRequestStatusEnum } from 'src/shared/types/residence-position-requests.enum';

export class ResidencePositionRequestsRepositoryImpl
  implements IResidencePositionRequestsRepository
{
  constructor() {}

  async findById(id: string): Promise<ResidencePositionRequest | undefined> {
    return await ResidencePositionRequest.query()
      .findById(id)
      .withGraphFetched('[residence, rankingCategory, requestedByUser, reviewedByUser]');
  }

  async findByResidenceAndCategory(
    residenceId: string,
    rankingCategoryId: string,
    requestedBy: string
  ): Promise<ResidencePositionRequest | undefined> {
    return await ResidencePositionRequest.query()
      .where({
        residenceId,
        rankingCategoryId,
        requestedBy,
      })
      .whereIn('status', ['NEW', 'PENDING'])
      .first();
  }

  async create(
    residencePositionRequest: Partial<ResidencePositionRequest>
  ): Promise<ResidencePositionRequest | undefined> {
    return ResidencePositionRequest.query().insertAndFetch(residencePositionRequest).returning('*');
  }

  async delete(id: string): Promise<void> {
    await ResidencePositionRequest.query().deleteById(id);
  }

  async update(
    id: string,
    data: Partial<ResidencePositionRequest>
  ): Promise<ResidencePositionRequest | undefined> {
    return ResidencePositionRequest.query().patchAndFetchById(id, data).returning('*');
  }

  async findAll(
    fetchQuery: FetchPositionRequestsQuery
  ): Promise<{ data: ResidencePositionRequest[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery, status } = fetchQuery;

    let baseQuery = ResidencePositionRequest.query()
      .modify((qb) => applyFilters(qb, { status }, ResidencePositionRequest.tableName))
      .leftJoinRelated('residence')
      .leftJoinRelated('rankingCategory')
      .leftJoinRelated('requestedByUser')
      .leftJoinRelated('reviewedByUser');

    if (fetchQuery.companyId) {
      baseQuery.where('residence.company_id', fetchQuery.companyId);
    }

    // search
    const columnsToSearch = [
      'residence.name',
      'ranking_category.name',
      'requested_by_user.full_name',
      'requested_by_user.email',
      'reviewed_by_user.full_name',
      'reviewed_by_user.email',
    ];

    baseQuery = applySearchFilter(baseQuery, searchQuery, columnsToSearch);

    // sort
    if (sortBy && sortOrder) {
      const allowedColumns = [
        'requestedPosition',
        'status',
        'requestedAt',
        'createdAt',
        'updatedAt',
      ];
      if (allowedColumns.includes(sortBy)) {
        baseQuery = baseQuery
          .orderByRaw(
            `CASE residence_position_requests.status
            WHEN ? THEN 1
            WHEN ? THEN 2
            WHEN ? THEN 3
            WHEN ? THEN 4
            ELSE 5
          END`,
            [
              ResidencePositionRequestStatusEnum.NEW,
              ResidencePositionRequestStatusEnum.PENDING,
              ResidencePositionRequestStatusEnum.APPROVED,
              ResidencePositionRequestStatusEnum.REJECTED,
            ]
          )
          .orderBy(sortBy, sortOrder);
      }
    }

    baseQuery.withGraphFetched('[residence, rankingCategory, requestedByUser, reviewedByUser]');

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
}
