import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IClaimProfileContactFormRepository } from '../../domain/claim-profile-contact-form.repository';

@Injectable()
export class DeleteClaimProfileContactFormCommandHandler {
  constructor(private readonly contactFormRepository: IClaimProfileContactFormRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const contactForm = await this.contactFormRepository.findById(id);
    if (!contactForm) {
      throw new NotFoundException('Claim Profile Contact Form not found');
    }

    await this.contactFormRepository.softDelete(id);
  }
}
