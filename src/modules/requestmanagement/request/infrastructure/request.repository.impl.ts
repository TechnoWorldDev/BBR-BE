import { Request } from '../domain/request.entity';
import { Injectable } from '@nestjs/common';
import { FetchRequestsQuery } from '../application/command/fetch-requests.query';
import { KnexService } from '../../../../shared/infrastructure/database/knex.service';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { applyPagination } from '../../../../shared/utils/pagination.util';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { IRequestRepository } from '../domain/irequest.repository.interface';
import { applyFilters } from '../../../../shared/filters/query.dynamic-filters';
import { Unit } from '../../../residentmanagement/unit/domain/unit.entity';

@Injectable()
export class RequestRepositoryImpl implements IRequestRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(data: Partial<Request>): Promise<Request | undefined> {
    const requestData = {
      leadId: data.lead?.id,
      type: data.type,
      subject: data.subject,
      message: data.message,
      entityId: data.entityId,
      status: data.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const insertedRequest = await knex('requests').insert(requestData).returning('*');

    return this.findById(insertedRequest[0].id);
  }

  async findById(id: string): Promise<Request | undefined> {
    return Request.query().findById(id).whereNull('deletedAt').withGraphFetched('[lead]');
  }

  async findOwnById(companyId: string, id: string): Promise<Request | undefined> {
    return Request.query()
      .findById(id)
      .whereNull('requests.deletedAt')
      .join('residences', 'requests.entity_id', 'residences.id')
      .andWhere('residences.companyId', companyId)
      .withGraphFetched('[lead]');
  }

  async findAll(
    query: FetchRequestsQuery
  ): Promise<{ data: Request[]; pagination: PaginationResponse }> {
    const knex = this.knexService.connection;
    const { page, limit, sortBy, sortOrder, searchQuery, leadId, type, status, companyId } = query;

    const searchableColumns = [
      'requests.subject',
      'requests.type',
      'requests.message',
      'lead.first_name',
      'lead.last_name',
      'lead.email',
    ];
    const sortableColumns = ['subject', 'type', 'createdAt', 'updatedAt'];

    let requestQuery = Request.query()
      .whereNull('requests.deleted_at')
      .withGraphFetched('[lead]')
      .modify((qb) => applyFilters(qb, { leadId, type, status }, Request.tableName))
      .join('leads as lead', 'lead.id', 'requests.leadId');

    if (companyId) {
      requestQuery = requestQuery
        .join('residences', 'requests.entityId', 'residences.id')
        .andWhere('residences.companyId', companyId);
    }

    requestQuery = applySearchFilter(requestQuery, searchQuery, searchableColumns);

    if (sortBy && sortOrder && sortableColumns.includes(sortBy)) {
      requestQuery = requestQuery.orderBy(sortBy, sortOrder);
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      requestQuery,
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

  async update(id: string, data: Partial<Request>): Promise<Request | undefined> {
    const knex = this.knexService.connection;

    await knex('requests')
      .update({
        status: data.status,
        note: data.note,
        updatedAt: new Date(),
      })
      .where('id', id);

    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await Request.query().patch({ deletedAt: new Date() }).where('id', id).whereNull('deletedAt');
  }
}
