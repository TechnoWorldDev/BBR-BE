import { ClaimProfileContactFormStatus } from '../../domain/claim-profile-contact-form-status.enum';

export class UpdateClaimProfileContactFormCommand {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phoneCodeId: string,
    public readonly phoneNumber: string,
    public readonly websiteUrl: string,
    public readonly cvId: string,
    public readonly status: ClaimProfileContactFormStatus,
  ) {}
}
