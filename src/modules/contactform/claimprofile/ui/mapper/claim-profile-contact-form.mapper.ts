import { ClaimProfileContactForm } from '../../domain/claim-profile-contact-form.entity';
import { CreateClaimProfileContactFormCommand } from '../../application/command/create-claim-profile-contact-form.command';
import { UpdateClaimProfileContactFormCommand } from '../../application/command/update-claim-profile-contact-form.command';
import { UpdateClaimProfileContactFormStatusCommand } from '../../application/command/update-claim-profile-contact-form-status.command';
import { ClaimProfileContactFormResponse } from '../response/claim-profile-contact-form.response';
import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { PhoneCodeResponse } from 'src/modules/shared/phone_code/ui/response/phone-code.response';
import { UpdateClaimProfileContactFormRequest } from '../request/update-claim-profile-contact-form.request';
import { UpdateClaimProfileContactFormStatusRequest } from '../request/update-claim-profile-contact-form-status.request';
import { CreateClaimProfileContactFormRequest } from '../request/create-claim-profile-contact-form.request';
import { CountryResponse } from '../../../../shared/phone_code/ui/response/country.response';
import { ResidenceMapper } from './residence.mapper';
import { UserMapper } from './user.mapper';

export class ClaimProfileContactFormMapper {
  static toCreateCommand(
    request: CreateClaimProfileContactFormRequest,
    email: string
  ): CreateClaimProfileContactFormCommand {
    return new CreateClaimProfileContactFormCommand(
      request.firstName,
      request.lastName,
      email,
      request.phoneCodeId,
      request.phoneNumber,
      request.websiteUrl,
      request.cvId,
      request.residenceId
    );
  }

  static toUpdateCommand(
    id: string,
    request: UpdateClaimProfileContactFormRequest
  ): UpdateClaimProfileContactFormCommand {
    return new UpdateClaimProfileContactFormCommand(
      id,
      request.firstName,
      request.lastName,
      '',
      request.phoneCodeId,
      request.phoneNumber,
      request.websiteUrl,
      request.cvId,
      request.status
    );
  }

  static toUpdateStatusCommand(
    id: string,
    request: UpdateClaimProfileContactFormStatusRequest
  ): UpdateClaimProfileContactFormStatusCommand {
    return new UpdateClaimProfileContactFormStatusCommand(id, request.status);
  }

  static toResponse(contactForm: ClaimProfileContactForm): ClaimProfileContactFormResponse {
    return new ClaimProfileContactFormResponse(
      contactForm.id,
      contactForm.firstName,
      contactForm.lastName,
      contactForm.email,
      contactForm.phoneNumber,
      contactForm.phoneCode
        ? new PhoneCodeResponse(
            contactForm.phoneCode.id,
            contactForm.phoneCode.code,
            contactForm.phoneCode.country
              ? new CountryResponse(
                  contactForm.phoneCode.country.id,
                  contactForm.phoneCode.country.name,
                  contactForm.phoneCode.country.flag
                )
              : null,
            contactForm.phoneCode.createdAt,
            contactForm.phoneCode.updatedAt
          )
        : null,
      contactForm.websiteUrl,
      contactForm.cv
        ? new MediaResponse(
            contactForm.cv.id,
            contactForm.cv.originalFileName,
            contactForm.cv.mimeType,
            contactForm.cv.uploadStatus,
            contactForm.cv.size,
            contactForm.cv.securedUrl
          )
        : null,
      contactForm.status,
      contactForm.residence ? ResidenceMapper.toResponse(contactForm.residence) : null,
      contactForm.createdBy ? UserMapper.toResponse(contactForm.createdBy) : null,
      contactForm.createdAt,
      contactForm.updatedAt
    );
  }
}
