import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IContactFormRepository } from '../../domain/contact-form.repository.interface';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { ContactForm } from '../../domain/contact-form.entity';
import { UpdateContactFormCommand } from '../command/update-contact-form.command';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class UpdateContactFormCommandHandler {
  constructor(
    private readonly contactFormRepository: IContactFormRepository,
    private readonly mediaRepository: IMediaRepository
  ) {}

  @LogMethod()
  async handle(command: UpdateContactFormCommand): Promise<ContactForm> {
    const contactForm = await this.contactFormRepository.findById(command.id);
    if (!contactForm) {
      throw new NotFoundException('Error Contact Form not found');
    }

    let attachment = await this.mediaRepository.findById(command.attachmentId);
      if (!attachment) {
        throw new NotFoundException('Media not found');
      }

    const updateData: Partial<ContactForm> = {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email ,
      link: command.link ,
      description: command.description,
      attachment: attachment,
    };

    const updatedForm = await this.contactFormRepository.update(command.id, updateData);
    if (!updatedForm) {
      throw new InternalServerErrorException('Contact Form not updated');
    }

    return updatedForm;
  }
}
