import { B2BFormSubmission } from '../../domain/b2b-form-submission.entity';
import { CreateB2BFormSubmissionRequest } from '../request/create-b2b-form-submission.request';
import { UpdateB2BFormSubmissionRequest } from '../request/update-b2b-form-submission.request';
import { UpdateB2BFormSubmissionStatusRequest } from '../request/update-b2b-form-submission-status.request';
import { CreateB2BFormSubmissionCommand } from '../../application/command/create-b2b-form-submission.command';
import { UpdateB2BFormSubmissionCommand } from '../../application/command/update-b2b-form-submission.command';
import { UpdateB2BFormSubmissionStatusCommand } from '../../application/command/update-b2b-form-submission-status.command';
import { B2BFormSubmissionResponse } from '../response/b2b-form-submission.response';

export class B2BFormSubmissionMapper {
  static toCreateCommand(
    request: CreateB2BFormSubmissionRequest
  ): CreateB2BFormSubmissionCommand {
    return new CreateB2BFormSubmissionCommand(
      request.name,
      request.phoneNumber,
      request.email,
      request.pageOrigin ?? null,
      request.companyName ?? null,
      request.brandedResidencesName ?? null,
      request.companyWebsite ?? null,
    );
  }

  static toUpdateCommand(
    id: string,
    request: UpdateB2BFormSubmissionRequest
  ): UpdateB2BFormSubmissionCommand {
    return new UpdateB2BFormSubmissionCommand(
      id,
      request.name,
      request.phoneNumber,
      request.email,
      request.status,
      request.pageOrigin,
      request.companyName ?? null,
      request.brandedResidencesName ?? null,
      request.companyWebsite ?? null,
    );
  }

  static toUpdateStatusCommand(
    id: string,
    request: UpdateB2BFormSubmissionStatusRequest
  ): UpdateB2BFormSubmissionStatusCommand {
    return new UpdateB2BFormSubmissionStatusCommand(id, request.status);
  }

  static toResponse(b2b: B2BFormSubmission): B2BFormSubmissionResponse {
    return new B2BFormSubmissionResponse(
      b2b.id,
      b2b.name,
      b2b.phoneNumber,
      b2b.email,
      b2b.companyName ?? null,
      b2b.brandedResidencesName ?? null,
      b2b.companyWebsite ?? null,
      b2b.pageOrigin,
      b2b.status,
      b2b.createdAt,
      b2b.updatedAt,
    );
  }
}
