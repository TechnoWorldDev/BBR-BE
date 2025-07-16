import { CareerContactForm } from '../../domain/career-contact-form.entity';
import { CreateCareerContactFormRequest } from '../request/create-career-contact-form.request';
import { CreateCareerContactFormCommand } from '../../application/command/create-career-contact-form.command';
import { UpdateCareerContactFormStatusCommand } from '../../application/command/update-career-contact-form-status.command';
import { CareerContactFormResponse } from '../response/career-contact-form.response';
import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { CareerContactFormStatusEnum } from '../../domain/career-contact-form-status.enum';
import { UpdateCareerContactFormRequest } from '../request/update-career-contact-form.request';
import { UpdateCareerContactFormStatusRequest } from '../request/update-career-contact-form-status.request';
import { UpdateCareerContactFormCommand } from '../../application/command/update-career-contact-form.command';

export class CareerContactFormMapper {
  static toCreateCommand(request: CreateCareerContactFormRequest): CreateCareerContactFormCommand {
    return new CreateCareerContactFormCommand(
      request.fullName,
      request.email,
      request.phone,
      request.linkedin,
      request.message,
      request.cvId,
      request.position,
      request.websiteURL
    );
  }

  static toUpdateCommand(
    id: string,
    request: UpdateCareerContactFormRequest
  ): UpdateCareerContactFormCommand {
    return new UpdateCareerContactFormCommand(
      id,
      request.status,
      request.note,
    );
  }

  static toUpdateStatusCommand(
    id: string,
    request: UpdateCareerContactFormStatusRequest
  ): UpdateCareerContactFormStatusCommand {
    return new UpdateCareerContactFormStatusCommand(id, request.status);
  }

  static toResponse(contactForm: CareerContactForm): CareerContactFormResponse {
    return new CareerContactFormResponse(
      contactForm.id,
      contactForm.fullName,
      contactForm.email,
      contactForm.phone,
      contactForm.linkedin,
      contactForm.message,
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
      contactForm.position,
      contactForm.websiteURL,
      contactForm.status as CareerContactFormStatusEnum,
      contactForm.note,
      contactForm.createdAt,
      contactForm.updatedAt
    );
  }
}
