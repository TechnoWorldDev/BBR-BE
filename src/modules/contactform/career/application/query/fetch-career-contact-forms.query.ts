import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { CareerContactForm } from '../../domain/career-contact-form.entity';
import { ICareerContactFormRepository } from '../../domain/career-contact-form.repository.interface';
import { FetchCareerContactFormsQuery } from '../command/fetch-career-contact-forms.query';

@Injectable()
export class FetchCareerContactFormsCommandQuery {
  constructor(private readonly contactFormRepository: ICareerContactFormRepository) {}

  @LogMethod()
  async handle(
    query: FetchCareerContactFormsQuery
  ): Promise<{ data: CareerContactForm[]; pagination: PaginationResponse }> {
    const result = await this.contactFormRepository.findAll(query);
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
