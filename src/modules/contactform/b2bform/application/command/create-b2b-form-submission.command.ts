import { B2BFormSubmissionStatus } from '../../domain/b2b-form-submission-status.enum';

export class CreateB2BFormSubmissionCommand {
  constructor(
    public readonly name: string,
    public readonly phoneNumber: string,
    public readonly email: string,
    public readonly pageOrigin: string,
    public readonly companyName: string | null,
    public readonly brandedResidencesName: string | null,
    public readonly companyWebsite: string | null
  ) {}
}
