import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { ContactForm } from '../../domain/contact-form.entity';
import { IContactFormRepository } from '../../domain/contact-form.repository.interface';
import { FetchContactFormsQuery } from '../command/fetch-contact-forms.query';

@Injectable()
export class FetchContactFormsCommandQuery {
  constructor(private readonly contactFormRepository: IContactFormRepository) {}

  @LogMethod()
  async handle(
    query: FetchContactFormsQuery
  ): Promise<{ data: ContactForm[]; pagination: PaginationResponse }> {
    const result = await this.contactFormRepository.findAll(query);
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
