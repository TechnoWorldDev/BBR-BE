
import { CareerContactForm } from './career-contact-form.entity';
import { FetchCareerContactFormsQuery } from '../application/command/fetch-career-contact-forms.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';

export abstract class ICareerContactFormRepository {
  abstract create(contactForm: Partial<CareerContactForm>): Promise<CareerContactForm | undefined>;
  abstract findById(id: string): Promise<CareerContactForm | undefined>;
  abstract findAll(
    query: FetchCareerContactFormsQuery
  ): Promise<{ data: CareerContactForm[]; pagination: PaginationResponse }>;
  abstract softDelete(id: string): Promise<void>;
  abstract update(id: string, data: Partial<CareerContactForm>): Promise<CareerContactForm | undefined>;
}
