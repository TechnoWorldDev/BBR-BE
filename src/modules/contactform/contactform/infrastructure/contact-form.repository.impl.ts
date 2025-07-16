import { IContactFormRepository } from '../domain/contact-form.repository.interface';
import { ContactForm } from '../domain/contact-form.entity';
import { Injectable } from '@nestjs/common';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { FetchContactFormsQuery } from '../application/command/fetch-contact-forms.query';
import { KnexService } from '../../../../shared/infrastructure/database/knex.service';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { applyFilters } from '../../../../shared/filters/query.dynamic-filters';
import { applyPagination } from '../../../../shared/utils/pagination.util';

@Injectable()
export class ContactFormRepositoryImpl implements IContactFormRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(contactForm: Partial<ContactForm>): Promise<ContactForm | undefined> {
    const data = {
      firstName: contactForm.firstName,
      lastName: contactForm.lastName,
      email: contactForm.email,
      link: contactForm.link,
      type: contactForm.type,
      description: contactForm.description,
      attachmentId: contactForm.attachment?.id ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const inserted = await knex('contact_forms')
      .insert(data)
      .returning('*');

    return this.findById(inserted[0].id);
  }

  async findById(id: string): Promise<ContactForm | undefined> {
    return ContactForm.query()
      .findById(id)
      .whereNull('deletedAt')
      .withGraphFetched('[attachment]');
  }

  async findAll(
    query: FetchContactFormsQuery
  ): Promise<{ data: ContactForm[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery, type } = query;

    let formQuery = ContactForm.query()
      .modify((qb) => applyFilters(qb, { type: type }, ContactForm.tableName))
      .whereNull('deletedAt')
      .withGraphFetched('[attachment]');

    const searchableColumns = ['firstName', 'lastName', 'email', 'link', 'description', 'type'];
    formQuery = applySearchFilter(formQuery, searchQuery, searchableColumns);

    if (sortBy && sortOrder && searchableColumns.includes(sortBy)) {
      formQuery = formQuery.orderBy(sortBy, sortOrder);
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(formQuery, page, limit);

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
    await ContactForm.query()
      .patch({ deletedAt: new Date() })
      .where('id', id)
      .whereNull('deletedAt');
  }

  async update(id: string, data: Partial<ContactForm>): Promise<ContactForm | undefined> {
    const knex = this.knexService.connection;

    const formData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      link: data.link,
      description: data.description,
      attachmentId: data.attachment?.id ?? null,
      updatedAt: new Date(),
    };

    const updated = await knex('contact_forms')
      .where('id', id)
      .update(formData)
      .returning('*');

    return this.findById( updated[0].id);
  }
}
