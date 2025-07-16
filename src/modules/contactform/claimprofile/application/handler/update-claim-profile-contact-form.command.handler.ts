import { Injectable } from '@nestjs/common';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { IClaimProfileContactFormRepository } from '../../domain/claim-profile-contact-form.repository';
import { ClaimProfileContactForm } from '../../domain/claim-profile-contact-form.entity';
import { UpdateClaimProfileContactFormCommand } from '../command/update-claim-profile-contact-form.command';
import { PhoneCode } from 'src/modules/shared/phone_code/domain/phone-code.entity';
import { Media } from 'src/modules/media/domain/media.entity';
import { IPhoneCodeRepository } from 'src/modules/shared/phone_code/domain/phone-code.repository.interface';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';

@Injectable()
export class UpdateClaimProfileContactFormCommandHandler {
  constructor(
    private readonly claimProfileContactFormRepository: IClaimProfileContactFormRepository,
    private readonly phoneCodeRepository: IPhoneCodeRepository,
    private readonly mediaRepository: IMediaRepository,
  ) {}

  async handle(command: UpdateClaimProfileContactFormCommand): Promise<ClaimProfileContactForm> {
    const claimProfileContactForm = await this.claimProfileContactFormRepository.findById(command.id);
    if (!claimProfileContactForm) {
      throw new NotFoundException('Claim Profile Contact Form not found');
    }

    let phoneCode: PhoneCode | undefined = undefined;
    if (command.phoneCodeId) {
      phoneCode = await this.phoneCodeRepository.findById(command.phoneCodeId);
      if (!phoneCode) {
        throw new NotFoundException('Phone code not found');
      }
    }

    let cv = await this.mediaRepository.findById(command.cvId);
      if (!cv) {
        throw new NotFoundException('CV (Media) not found');
      }

    const updateData: Partial<ClaimProfileContactForm> = {
      firstName: command.firstName || claimProfileContactForm.firstName,
      lastName: command.lastName || claimProfileContactForm.lastName,
      email: claimProfileContactForm.email,
      phoneCode: phoneCode || claimProfileContactForm.phoneCode,
      phoneNumber: command.phoneNumber || claimProfileContactForm.phoneNumber,
      websiteUrl: command.websiteUrl || claimProfileContactForm.websiteUrl,
      cv: cv || claimProfileContactForm.cv,
      status: command.status || claimProfileContactForm.status,
    };

    const updatedContactForm = await this.claimProfileContactFormRepository.update(claimProfileContactForm.id, updateData);
    if (!updatedContactForm) {
      throw new InternalServerErrorException('Claim Profile Contact Form not updated');
    }

    return updatedContactForm;
  }
}
