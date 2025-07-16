import { IsEnum, IsNotEmpty } from 'class-validator';
import { ClaimProfileContactFormStatus } from '../../domain/claim-profile-contact-form-status.enum';  // assuming status is in this enum file

export class UpdateClaimProfileContactFormStatusRequest {
  @IsNotEmpty()
  @IsEnum(ClaimProfileContactFormStatus)
  status: ClaimProfileContactFormStatus;
}
