import { ContactForm } from './contact-form.entity';
import { FetchContactFormsQuery } from '../application/command/fetch-contact-forms.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';

export abstract class IContactFormRepository {
  abstract create(contactForm: Partial<ContactForm>): Promise<ContactForm | undefined>;
  abstract findById(id: string): Promise<ContactForm | undefined>;
  abstract findAll(
    query: FetchContactFormsQuery
  ): Promise<{ data: ContactForm[]; pagination: PaginationResponse }>;
  abstract softDelete(id: string): Promise<void>;
  abstract update(id: string, data: Partial<ContactForm>): Promise<ContactForm | undefined>;
}
