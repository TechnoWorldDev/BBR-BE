import { Injectable } from '@nestjs/common';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ICareerContactFormRepository } from '../../domain/career-contact-form.repository.interface';
import { CareerContactForm } from '../../domain/career-contact-form.entity';
import { UpdateCareerContactFormStatusCommand } from '../command/update-career-contact-form-status.command';

@Injectable()
export class UpdateCareerContactFormStatusCommandHandler {
  constructor(
    private readonly contactFormRepository: ICareerContactFormRepository,
  ) {}

  async handle(command: UpdateCareerContactFormStatusCommand): Promise<CareerContactForm> {
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
      note: contactForm.note,
      status: command.status,
    };

    const updatedContactForm = await this.contactFormRepository.update(contactForm.id, updateData);
    if (!updatedContactForm) {
      throw new InternalServerErrorException('Contact Form not updated');
    }

    return updatedContactForm;
  }
}
