import { ClaimProfileContactForm } from './claim-profile-contact-form.entity';
import { FetchClaimProfileContactFormsQuery } from '../application/command/fetch-claim-profile-contact-forms.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { User } from 'src/modules/user/domain/user.entity';

export abstract class IClaimProfileContactFormRepository {
  abstract create(
    contactForm: Partial<ClaimProfileContactForm>
  ): Promise<ClaimProfileContactForm | undefined>;
  abstract findById(id: string): Promise<ClaimProfileContactForm | undefined>;
  abstract findByResidenceId(residenceId: string): Promise<ClaimProfileContactForm | undefined>;
  abstract findAll(
    query: FetchClaimProfileContactFormsQuery
  ): Promise<{ data: ClaimProfileContactForm[]; pagination: PaginationResponse }>;
  abstract findAllByUser(
    user: User,
    query: FetchClaimProfileContactFormsQuery
  ): Promise<{ data: ClaimProfileContactForm[]; pagination: PaginationResponse }>;
  abstract softDelete(id: string): Promise<void>;
  abstract update(
    id: string,
    data: Partial<ClaimProfileContactForm>
  ): Promise<ClaimProfileContactForm | undefined>;
}
