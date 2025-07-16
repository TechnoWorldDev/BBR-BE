import { Injectable, NotFoundException } from '@nestjs/common';
import { ICareerContactFormRepository } from '../../domain/career-contact-form.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class DeleteCareerContactFormCommandHandler {
  constructor(private readonly contactFormRepository: ICareerContactFormRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const contactForm = await this.contactFormRepository.findById(id);
    if (!contactForm) throw new NotFoundException('Contact Form not found');

    await this.contactFormRepository.softDelete(id);
  }
}
