import { Injectable, NotFoundException } from '@nestjs/common';
import { IContactFormRepository } from '../../domain/contact-form.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class DeleteContactFormCommandHandler {
  constructor(private readonly contactFormRepository: IContactFormRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const contactForm = await this.contactFormRepository.findById(id);

    if (!contactForm) {
      throw new NotFoundException('Contact Form not found');
    }

    await this.contactFormRepository.softDelete(id);
  }
}
