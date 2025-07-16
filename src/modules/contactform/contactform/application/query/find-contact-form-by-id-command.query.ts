import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IContactFormRepository } from '../../domain/contact-form.repository.interface';
import { ContactForm } from '../../domain/contact-form.entity';

@Injectable()
export class FindContactFormByIdCommandQuery {
  constructor(private readonly contactFormRepository: IContactFormRepository) {}

  @LogMethod()
  async handle(id: string): Promise<ContactForm> {
    const contactForm = await this.contactFormRepository.findById(id);
    if (!contactForm) {
      throw new NotFoundException('Contact form not found');
    }
    return contactForm;
  }
}
