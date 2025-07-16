import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { ICareerContactFormRepository } from '../../domain/career-contact-form.repository.interface';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { CareerContactForm } from '../../domain/career-contact-form.entity';
import { UpdateCareerContactFormCommand } from '../command/update-career-contact-form.command';
import { CareerContactFormStatusEnum } from '../../domain/career-contact-form-status.enum';

@Injectable()
export class UpdateCareerContactFormCommandHandler {
  constructor(
    private readonly contactFormRepository: ICareerContactFormRepository,
  ) {}

  @LogMethod()
  async handle(command: UpdateCareerContactFormCommand): Promise<CareerContactForm> {
    const contactForm = await this.contactFormRepository.findById(command.id);
    if (!contactForm) {
      throw new NotFoundException('Contact Form not found');
    }

    const updateData: Partial<CareerContactForm> = {
      fullName: contactForm.fullName,
      email: contactForm.email,
      phone: contactForm.phone,
      linkedin: contactForm.linkedin,
      message: contactForm.message,
      cv: contactForm.cv,
      position: contactForm.position,
      websiteURL: contactForm.websiteURL,
      status: command.status,
      note: command.note,
    };

    const updatedContactForm = await this.contactFormRepository.update(contactForm.id, updateData);
    if (!updatedContactForm) {
      throw new InternalServerErrorException('Contact Form not updated');
    }

    return updatedContactForm;
  }
}
