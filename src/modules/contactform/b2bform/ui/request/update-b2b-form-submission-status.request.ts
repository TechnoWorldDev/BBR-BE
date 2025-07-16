import { IsEnum, IsNotEmpty } from 'class-validator';
import { B2BFormSubmissionStatus } from '../../domain/b2b-form-submission-status.enum';

export class UpdateB2BFormSubmissionStatusRequest {
  @IsNotEmpty()
  @IsEnum(B2BFormSubmissionStatus)
  status: B2BFormSubmissionStatus;
}
