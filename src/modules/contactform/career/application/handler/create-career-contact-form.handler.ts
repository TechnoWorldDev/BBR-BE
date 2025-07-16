import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { CareerContactForm } from '../../domain/career-contact-form.entity';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { Media } from 'src/modules/media/domain/media.entity';
import { CreateCareerContactFormCommand } from '../command/create-career-contact-form.command';
import { ICareerContactFormRepository } from '../../domain/career-contact-form.repository.interface';
import { CareerContactFormStatusEnum } from '../../domain/career-contact-form-status.enum';
import { EmailQueue } from 'src/modules/email/infrastructure/queues/email.queue';
import { EmailAction } from 'src/modules/email/domain/email-action.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateCareerContactFormCommandHandler {
  constructor(
    private readonly contactFormRepository: ICareerContactFormRepository,
    private readonly mediaRepository: IMediaRepository,
    private readonly emailQueue: EmailQueue,
    private readonly configService: ConfigService
  ) {}

  @LogMethod()
  async handle(command: CreateCareerContactFormCommand): Promise<CareerContactForm> {
    let cv: Media | undefined = undefined;
    if (command.cvId) {
      cv = await this.mediaRepository.findById(command.cvId);
      if (!cv) {
        throw new NotFoundException('CV not found');
      }
    }

    const contactFormData: Partial<CareerContactForm> = {
      fullName: command.fullName,
      email: command.email,
      phone: command.phone,
      linkedin: command.linkedin,
      message: command.message,
      cv: cv,
      position: command.position,
      websiteURL: command.websiteURL,
      status: CareerContactFormStatusEnum.NEW,
    };

    const createdContactForm = await this.contactFormRepository.create(contactFormData);

    if (!createdContactForm) {
      throw new InternalServerErrorException('Contact Form could not be saved');
    }

    await this.emailQueue.addEmailJob(EmailAction.JOB_APPLICATION, {
      to: command.email,
      variables: {
        fullName: `${command.fullName}`,
        exploreMoreOpportunitiesLink: `${this.configService.get<string>('FRONTEND_URL')}/careers`,
      },
    });

    return createdContactForm;
  }
}
