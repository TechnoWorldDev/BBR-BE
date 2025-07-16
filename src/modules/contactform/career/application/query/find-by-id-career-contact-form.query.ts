import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { ICareerContactFormRepository } from '../../domain/career-contact-form.repository.interface';
import { CareerContactForm } from '../../domain/career-contact-form.entity';

@Injectable()
export class FindCareerContactFormByIdCommandQuery {
  constructor(private readonly contactFormRepository: ICareerContactFormRepository) {}

  @LogMethod()
  async handle(id: string): Promise<CareerContactForm> {
    const contactForm = await this.contactFormRepository.findById(id);
    if (!contactForm) {
      throw new NotFoundException('Contact form not found');
    }
    return contactForm;
  }
}
