import { Injectable } from '@nestjs/common';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { IClaimProfileContactFormRepository } from '../../domain/claim-profile-contact-form.repository';
import { ClaimProfileContactForm } from '../../domain/claim-profile-contact-form.entity';
import { UpdateClaimProfileContactFormStatusCommand } from '../command/update-claim-profile-contact-form-status.command';
import { ClaimProfileContactFormStatus } from '../../domain/claim-profile-contact-form-status.enum';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { IUserRepository } from '../../domain/user.repository.interface';
import { ConfigService } from '@nestjs/config';
import { EmailQueue } from 'src/modules/email/infrastructure/queues/email.queue';
import { EmailAction } from 'src/modules/email/domain/email-action.enum';

@Injectable()
export class UpdateClaimProfileContactFormStatusCommandHandler {
  constructor(
    private readonly claimProfileContactFormRepository: IClaimProfileContactFormRepository,
    private readonly userRepository: IUserRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly emailQueue: EmailQueue,
    private readonly configService: ConfigService
  ) {}

  async handle(
    command: UpdateClaimProfileContactFormStatusCommand
  ): Promise<ClaimProfileContactForm> {
    const claimProfileContactForm = await this.claimProfileContactFormRepository.findById(
      command.id
    );

    if (!claimProfileContactForm) {
      throw new NotFoundException('Claim Profile Contact Form not found');
    }

    const updateData: Partial<ClaimProfileContactForm> = {
      firstName: claimProfileContactForm.firstName,
      lastName: claimProfileContactForm.lastName,
      email: claimProfileContactForm.email,
      phoneCode: claimProfileContactForm.phoneCode,
      phoneNumber: claimProfileContactForm.phoneNumber,
      websiteUrl: claimProfileContactForm.websiteUrl,
      cv: claimProfileContactForm.cv,
      status: command.status,
    };

    const updatedContactForm = await this.claimProfileContactFormRepository.update(
      claimProfileContactForm.id,
      updateData
    );

    if (
      command.status === ClaimProfileContactFormStatus.ACCEPTED &&
      claimProfileContactForm.residence
    ) {
      const user = await this.userRepository.findById(claimProfileContactForm.createdBy.id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.residenceRepository.assignToCompanyId(
        claimProfileContactForm.residence.id,
        user.companyId
      );

      await this.emailQueue.addEmailJob(EmailAction.OWNERSHIP_REQUEST_ACCEPTED, {
        to: user.email,
        variables: {
          fullName: `${user.fullName}`,
          residenceName: `${claimProfileContactForm.residence.name}`,
          manageResidencesLink: `${this.configService.get<string>('FRONTEND_URL')}/developer/residences`,
        },
      });
    }

    if (
      command.status === ClaimProfileContactFormStatus.REJECTED &&
      claimProfileContactForm.residence
    ) {
      const user = await this.userRepository.findById(claimProfileContactForm.createdBy.id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.emailQueue.addEmailJob(EmailAction.OWNERSHIP_REQUEST_DECLINED, {
        to: user.email,
        variables: {
          fullName: `${user.fullName}`,
          residenceName: `${claimProfileContactForm.residence.name}`,
          manageResidencesLink: `${this.configService.get<string>('FRONTEND_URL')}/developer/residences`,
        },
      });
    }

    if (!updatedContactForm) {
      throw new InternalServerErrorException('Claim Profile Contact Form not updated');
    }

    return updatedContactForm;
  }
}
