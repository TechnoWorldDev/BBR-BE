import { B2BFormSubmission } from './b2b-form-submission.entity';
import { FetchB2BFormSubmissionsQuery } from '../application/command/fetch-b2b-form-submissions.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';

export abstract class IB2BFormSubmissionRepository {
  abstract create(
    form: Partial<B2BFormSubmission>
  ): Promise<B2BFormSubmission | undefined>;

  abstract findById(id: string): Promise<B2BFormSubmission | undefined>;

  abstract findAll(
    query: FetchB2BFormSubmissionsQuery
  ): Promise<{ data: B2BFormSubmission[]; pagination: PaginationResponse }>;

  abstract softDelete(id: string): Promise<void>;

  abstract update(
    id: string,
    data: Partial<B2BFormSubmission>
  ): Promise<B2BFormSubmission | undefined>;
}
