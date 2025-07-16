import { Injectable } from '@nestjs/common';
import { B2BFormSubmission } from '../domain/b2b-form-submission.entity';
import { IB2BFormSubmissionRepository } from '../domain/b2b-form-submission.repository.interface';
import { KnexService } from '../../../../shared/infrastructure/database/knex.service';
import { FetchB2BFormSubmissionsQuery } from '../application/command/fetch-b2b-form-submissions.query';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { applyFilters } from 'src/shared/filters/query.dynamic-filters';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';

@Injectable()
export class B2BFormSubmissionRepositoryImpl implements IB2BFormSubmissionRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(form: Partial<B2BFormSubmission>): Promise<B2BFormSubmission | undefined> {
    const data = {
      name: form.name,
      phoneNumber: form.phoneNumber,
      email: form.email,
      pageOrigin: form.pageOrigin,
      companyName: form.companyName ?? null,
      brandedResidencesName: form.brandedResidencesName ?? null,
      companyWebsite: form.companyWebsite ?? null,
      status: form.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const inserted = await knex('b2b_form_submissions')
      .insert(data)
      .returning('*');

    return this.findById(inserted[0].id);
  }

  async findById(id: string): Promise<B2BFormSubmission | undefined> {
    return B2BFormSubmission.query()
      .findById(id)
      .whereNull('deletedAt');
  }

  async findAll(
    query: FetchB2BFormSubmissionsQuery
  ): Promise<{ data: B2BFormSubmission[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery, status } = query;

    let b2bQuery = B2BFormSubmission.query()
      .modify((qb) => applyFilters(qb, { status }, B2BFormSubmission.tableName))
      .whereNull('deletedAt');

    const searchableColumns = ['name', 'phoneNumber', 'email', 'companyName', 'brandedResidencesName', 'companyWebsite', 'pageOrigin', 'status'];
    b2bQuery = applySearchFilter(b2bQuery, searchQuery, searchableColumns);

    if (sortBy && sortOrder && searchableColumns.includes(sortBy)) {
      b2bQuery = b2bQuery.orderBy(sortBy, sortOrder);
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(b2bQuery, page, limit);

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

  async softDelete(id: string): Promise<void> {
    await B2BFormSubmission.query()
      .patch({ deletedAt: new Date() })
      .where('id', id)
      .whereNull('deletedAt');
  }

  async update(id: string, data: Partial<B2BFormSubmission>): Promise<B2BFormSubmission | undefined> {
    const updateData = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      pageOrigin: data.pageOrigin,
      companyName: data.companyName ?? null,
      brandedResidencesName: data.brandedResidencesName ?? null,
      companyWebsite: data.companyWebsite ?? null,
      status: data.status,
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const updated = await knex('b2b_form_submissions')
      .where('id', id)
      .update(updateData)
      .returning('*');

    return this.findById(updated[0].id);
  }
}
