import { ClaimProfileContactForm } from '../domain/claim-profile-contact-form.entity';
import { Injectable } from '@nestjs/common';
import { KnexService } from '../../../../shared/infrastructure/database/knex.service';
import { applyFilters } from '../../../../shared/filters/query.dynamic-filters';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { FetchClaimProfileContactFormsQuery } from '../application/command/fetch-claim-profile-contact-forms.query';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { applyPagination } from '../../../../shared/utils/pagination.util';
import { IClaimProfileContactFormRepository } from '../domain/claim-profile-contact-form.repository';
import { User } from 'src/modules/user/domain/user.entity';

@Injectable()
export class ClaimProfileContactFormRepositoryImpl implements IClaimProfileContactFormRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(
    contactForm: Partial<ClaimProfileContactForm>
  ): Promise<ClaimProfileContactForm | undefined> {
    const contactFormData = {
      firstName: contactForm.firstName,
      lastName: contactForm.lastName,
      email: contactForm.email,
      phoneCodeId: contactForm.phoneCode?.id,
      phoneNumber: contactForm.phoneNumber,
      websiteUrl: contactForm.websiteUrl,
      cvId: contactForm.cv?.id,
      status: contactForm.status,
      residenceId: contactForm.residenceId,
      userId: contactForm.userId,
    };

    const knex = this.knexService.connection;

    const insertedContactForm = await knex('claim_profile_contact_forms')
      .insert(contactFormData)
      .returning('*');

    return this.findById(insertedContactForm[0].id);
  }

  async findById(id: string): Promise<ClaimProfileContactForm | undefined> {
    return ClaimProfileContactForm.query()
      .findById(id)
      .whereNull('deletedAt')
      .withGraphFetched('[cv, phoneCode.[country], residence, createdBy]');
  }

  async findByResidenceId(residenceId: string): Promise<ClaimProfileContactForm | undefined> {
    return ClaimProfileContactForm.query().findOne({ residenceId }).whereNull('deletedAt');
  }

  async findAll(
    query: FetchClaimProfileContactFormsQuery
  ): Promise<{ data: ClaimProfileContactForm[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery, createdBy } = query;

    let contactFormQuery = ClaimProfileContactForm.query()
      .modify((qb) => {
        if (createdBy) {
          qb.where('user_id', '=', createdBy);
        }
        return applyFilters(qb, {}, ClaimProfileContactForm.tableName);
      })
      .whereNull('deletedAt')
      .withGraphFetched('[cv, phoneCode.[country], residence, createdBy]');

    const columnsToSearchAndSort = ['firstName', 'lastName', 'email', 'phoneNumber', 'websiteUrl'];
    contactFormQuery = applySearchFilter(contactFormQuery, searchQuery, columnsToSearchAndSort);

    if (sortBy && sortOrder) {
      contactFormQuery = contactFormQuery.orderBy(sortBy, sortOrder);
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      contactFormQuery,
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

  async findAllByUser(
    user: User,
    query: FetchClaimProfileContactFormsQuery
  ): Promise<{ data: ClaimProfileContactForm[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery } = query;

    let contactFormQuery = ClaimProfileContactForm.query()
      .modify((qb) => applyFilters(qb, {}, ClaimProfileContactForm.tableName))
      .whereNull('deletedAt')
      .withGraphFetched('[cv, phoneCode.[country], residence, createdBy]');

    const columnsToSearchAndSort = ['firstName', 'lastName', 'email', 'phoneNumber', 'websiteUrl'];
    contactFormQuery = applySearchFilter(contactFormQuery, searchQuery, columnsToSearchAndSort);

    if (sortBy && sortOrder) {
      contactFormQuery = contactFormQuery.orderBy(sortBy, sortOrder);
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      contactFormQuery,
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

  async softDelete(id: string): Promise<void> {
    await ClaimProfileContactForm.query()
      .patch({ deletedAt: new Date() })
      .where('id', id)
      .whereNull('deletedAt');
  }

  async update(
    id: string,
    data: Partial<ClaimProfileContactForm>
  ): Promise<ClaimProfileContactForm | undefined> {
    const knex = this.knexService.connection;

    const contactFormData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneCodeId: data.phoneCode?.id,
      phoneNumber: data.phoneNumber,
      websiteUrl: data.websiteUrl,
      cvId: data.cv?.id,
      status: data.status,
    };

    await knex('claim_profile_contact_forms')
      .where('id', id)
      .update({
        ...contactFormData,
        updatedAt: new Date(),
      });

    return this.findById(id);
  }
}
