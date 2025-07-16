import { ClaimProfileContactFormStatus } from '../../domain/claim-profile-contact-form-status.enum';

export class UpdateClaimProfileContactFormStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: ClaimProfileContactFormStatus,
  ) {}
}
