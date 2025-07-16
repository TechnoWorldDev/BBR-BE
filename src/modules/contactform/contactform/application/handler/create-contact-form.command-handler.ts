import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { ContactForm } from '../../domain/contact-form.entity';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { CreateContactFormCommand } from '../command/create-contact-form.command';
import { IContactFormRepository } from '../../domain/contact-form.repository.interface';
import { EmailQueue } from 'src/modules/email/infrastructure/queues/email.queue';
import { EmailAction } from 'src/modules/email/domain/email-action.enum';
import { ConfigService } from '@nestjs/config';
import { ContactFormType } from '../../domain/contact-form-type.enum';

@Injectable()
export class CreateContactFormCommandHandler {
  constructor(
    private readonly contactFormRepository: IContactFormRepository,
    private readonly mediaRepository: IMediaRepository,
    private readonly emailQueue: EmailQueue,
    private readonly configService: ConfigService
  ) {}

  @LogMethod()
  async handle(command: CreateContactFormCommand): Promise<ContactForm> {
    const attachment = await this.mediaRepository.findById(command.attachmentId);
    if (!attachment) {
      throw new NotFoundException('Media not found');
    }

    const contactFormData: Partial<ContactForm> = {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      link: command.link,
      type: command.type,
      description: command.description,
      attachment: attachment,
    };

    const createdContactForm = await this.contactFormRepository.create(contactFormData);

    if (!createdContactForm) {
      throw new InternalServerErrorException('Contact Form could not be saved');
    }

    const mapContactType = {
      [ContactFormType.ERROR]: EmailAction.REPORT_AN_ERROR,
      [ContactFormType.SUGGEST_FEATURE]: EmailAction.SUGGEST_FEATURE,
    };

    // * Send Email to Sender
    await this.emailQueue.addEmailJob(mapContactType[command.type], {
      to: command.email,
      variables: {
        fullName: `${command.firstName} ${command.lastName}`,
        exploreMoreResidencesLink: `${this.configService.get<string>('FRONTEND_URL')}/residences`,
      },
    });

    return createdContactForm;
  }
}
