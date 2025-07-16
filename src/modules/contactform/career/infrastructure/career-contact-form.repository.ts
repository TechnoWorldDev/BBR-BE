import { ICareerContactFormRepository } from '../domain/career-contact-form.repository.interface';
import { CareerContactForm } from '../domain/career-contact-form.entity';
import { Injectable } from '@nestjs/common';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { FetchCareerContactFormsQuery } from '../application/command/fetch-career-contact-forms.query';
import { KnexService } from '../../../../shared/infrastructure/database/knex.service';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { applyFilters } from '../../../../shared/filters/query.dynamic-filters';
import { applyPagination } from '../../../../shared/utils/pagination.util';

@Injectable()
export class CareerContactFormRepositoryImpl implements ICareerContactFormRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(contactForm: Partial<CareerContactForm>): Promise<CareerContactForm | undefined> {
    const contactFormData = {
      fullName: contactForm.fullName,
      email: contactForm.email,
      phone: contactForm.phone,
      linkedin: contactForm.linkedin,
      message: contactForm.message,
      position: contactForm.position,
      websiteURL: contactForm.websiteURL,
      status: contactForm.status,
      cvId: contactForm.cv?.id, 
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const insertedContactForm = await knex('career_contact_forms')
      .insert(contactFormData)
      .returning('*');

    return this.findById(insertedContactForm[0].id);
  }

  async findById(id: string): Promise<CareerContactForm | undefined> {
    return CareerContactForm.query()
      .findById(id)
      .whereNull('deletedAt')
      .withGraphFetched('[cv]');
  }

  async findAll(
    query: FetchCareerContactFormsQuery
  ): Promise<{ data: CareerContactForm[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery, position, websiteURL } = query;

    let contactFormQuery = CareerContactForm.query()
      .modify((qb) => applyFilters(qb, { position, websiteURL }, CareerContactForm.tableName))
      .whereNull('deletedAt')
      .withGraphFetched('[cv]'); 

    const columnsToSearchAndSort = ['fullName', 'email', 'phone', 'position', 'websiteURL'];
    contactFormQuery = applySearchFilter(contactFormQuery, searchQuery, columnsToSearchAndSort);

    if (sortBy && sortOrder) {
      if (columnsToSearchAndSort.includes(sortBy)) {
        contactFormQuery = contactFormQuery.orderBy(sortBy, sortOrder);
      }
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(contactFormQuery, page, limit);

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
    await CareerContactForm.query()
      .patch({ deletedAt: new Date() })
      .where('id', id)
      .whereNull('deletedAt');
  }

  async update(id: string, data: Partial<CareerContactForm>): Promise<CareerContactForm | undefined> {
    const knex = this.knexService.connection;

    const contactFormData = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      linkedin: data.linkedin,
      message: data.message,
      position: data.position,
      websiteURL: data.websiteURL,
      status: data.status,
      note: data.note,
      cvId: data.cv?.id, 
      createdAt: new Date(),
      updatedAt: new Date(),
    };


    const updatedContactForm = await knex('career_contact_forms')
      .where('id', id)
      .update({
        ...contactFormData, 
        updatedAt: new Date(),
      })
      .returning('*');

    return updatedContactForm[0]; 
  }
}
