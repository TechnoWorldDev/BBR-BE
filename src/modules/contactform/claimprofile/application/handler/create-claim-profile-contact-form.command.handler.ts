import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { ClaimProfileContactForm } from '../../domain/claim-profile-contact-form.entity';
import { IPhoneCodeRepository } from 'src/modules/shared/phone_code/domain/phone-code.repository.interface';
import { PhoneCode } from 'src/modules/shared/phone_code/domain/phone-code.entity';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { CreateClaimProfileContactFormCommand } from '../command/create-claim-profile-contact-form.command';
import { ClaimProfileContactFormStatus } from '../../domain/claim-profile-contact-form-status.enum';
import { IClaimProfileContactFormRepository } from '../../domain/claim-profile-contact-form.repository';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { User } from 'src/modules/user/domain/user.entity';
import { EmailQueue } from 'src/modules/email/infrastructure/queues/email.queue';
import { ConfigService } from '@nestjs/config';
import { EmailAction } from 'src/modules/email/domain/email-action.enum';

@Injectable()
export class CreateClaimProfileContactFormCommandHandler {
  constructor(
    private readonly contactFormRepository: IClaimProfileContactFormRepository,
    private readonly phoneCodeRepository: IPhoneCodeRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly mediaRepository: IMediaRepository,
    private readonly emailQueue: EmailQueue,
    private readonly configService: ConfigService
  ) {}

  @LogMethod()
  async handle(
    user: User,
    command: CreateClaimProfileContactFormCommand
  ): Promise<ClaimProfileContactForm> {
    let phoneCode: PhoneCode | undefined = undefined;

    const existingResidence = await this.residenceRepository.findById(command.residenceId);

    if (!existingResidence) {
      throw new NotFoundException('Residence not found');
    }

    const existClaimProfileContactForm = await this.contactFormRepository.findByResidenceId(
      command.residenceId
    );

    if (existClaimProfileContactForm) {
      throw new InternalServerErrorException('Claim Profile Contact Form already exists');
    }

    if (command.phoneCodeId) {
      phoneCode = await this.phoneCodeRepository.findById(command.phoneCodeId);
      if (!phoneCode) {
        throw new NotFoundException('Phone code not found');
      }
    }

    let cv = await this.mediaRepository.findById(command.cvId);
    if (!cv) {
      throw new NotFoundException('Media not found');
    }

    const contactFormData: Partial<ClaimProfileContactForm> = {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phoneCode: phoneCode,
      phoneNumber: command.phoneNumber,
      websiteUrl: command.websiteUrl,
      cv: cv,
      status: ClaimProfileContactFormStatus.NEW,
      residenceId: command.residenceId,
      userId: user.id,
    };

    const createdContactForm = await this.contactFormRepository.create(contactFormData);

    if (!createdContactForm) {
      throw new InternalServerErrorException('Contact form could not be saved');
    }

    // * send email to claimer
    await this.emailQueue.addEmailJob(EmailAction.OWNERSHIP_REQUEST, {
      to: user.email,
      variables: {
        fullName: `${user.fullName}`,
        residenceName: `${existingResidence.name}`,
        manageResidencesLink: `${this.configService.get<string>('FRONTEND_URL')}/developer/residences`,
      },
    });

    return createdContactForm;
  }
}
