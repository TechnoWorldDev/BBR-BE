import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { ClaimProfileContactForm } from '../../domain/claim-profile-contact-form.entity';
import { IClaimProfileContactFormRepository } from '../../domain/claim-profile-contact-form.repository';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { User } from 'src/modules/user/domain/user.entity';

@Injectable()
export class FindClaimProfileContactFormByIdCommandQuery {
  constructor(
    private readonly claimProfileContactFormRepository: IClaimProfileContactFormRepository
  ) {}

  @LogMethod()
  async handle(user: User, id: string): Promise<ClaimProfileContactForm> {
    const hasOwnPermission = user.role.permissions?.includes(
      PermissionsEnum.CLAIM_PROFILE_CONTACT_FORMS_READ_OWN
    );

    const claimProfileContactForm = await this.claimProfileContactFormRepository.findById(id);

    if (!claimProfileContactForm) {
      throw new NotFoundException('Claim Profile Contact Form not found');
    }

    if (hasOwnPermission && user.id !== claimProfileContactForm.createdBy.id) {
      throw new NotFoundException('Claim Profile Contact Form not found');
    }

    return claimProfileContactForm;
  }
}
