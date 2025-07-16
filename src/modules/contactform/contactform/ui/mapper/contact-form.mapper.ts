import { ContactForm } from '../../domain/contact-form.entity';
import { CreateContactFormRequest } from '../request/create-contact-form.request';
import { CreateContactFormCommand } from '../../application/command/create-contact-form.command';
import { UpdateContactFormCommand } from '../../application/command/update-contact-form.command';
import { ContactFormResponse } from '../response/contact-form.response';
import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { UpdateContactFormRequest } from '../request/update-contact-form.request';

export class ContactFormMapper {
  static toCreateCommand(request: CreateContactFormRequest): CreateContactFormCommand {
    return new CreateContactFormCommand(
      request.firstName,
      request.lastName,
      request.email,
      request.link,
      request.description,
      request.attachmentId,
      request.type
    );
  }

  static toUpdateCommand(
    id: string,
    request: UpdateContactFormRequest
  ): UpdateContactFormCommand {
    return new UpdateContactFormCommand(
      id,
      request.firstName,
      request.lastName,
      request.email,
      request.link,
      request.description,
      request.attachmentId
    );
  }

  static toResponse(contactForm: ContactForm): ContactFormResponse {
    return new ContactFormResponse(
      contactForm.id,
      contactForm.firstName,
      contactForm.lastName,
      contactForm.email,
      contactForm.link,
      contactForm.description,
      contactForm.attachment
        ? new MediaResponse(
          contactForm.attachment.id,
          contactForm.attachment.originalFileName,
          contactForm.attachment.mimeType,
          contactForm.attachment.uploadStatus,
          contactForm.attachment.size,
          contactForm.attachment.securedUrl
        )
        : null,
      contactForm.type,
      contactForm.createdAt,
      contactForm.updatedAt
    );
  }
}
