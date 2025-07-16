import { B2BFormSubmissionStatus } from '../../domain/b2b-form-submission-status.enum';

export class UpdateB2BFormSubmissionStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: B2BFormSubmissionStatus,
  ) {}
}
