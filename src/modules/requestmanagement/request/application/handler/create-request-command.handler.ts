import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRequestCommand } from '../command/create-request.command';
import { IRequestRepository } from '../../domain/irequest.repository.interface';
import { Request } from '../../domain/request.entity';
import { ILeadRepository } from '../../../lead/domain/ilead.repository.interface';
import { CreateLeadCommandHandler } from '../../../lead/application/handler/create-lead-command.handler';
import { CreateLeadCommand } from '../../../lead/application/command/create-lead.command';
import { RequestStatusEnum } from '../../domain/request-status.enum';
import { UpdateLeadCommandHandler } from '../../../lead/application/handler/update-lead.command.handler';
import { UpdateLeadCommand } from '../../../lead/application/command/update-lead.command';
import { EmailQueue } from 'src/modules/email/infrastructure/queues/email.queue';
import { ConfigService } from '@nestjs/config';
import { EmailAction } from 'src/modules/email/domain/email-action.enum';
import { RequestTypeEnum } from '../../domain/request-type.enum';
import { map } from 'rxjs';
import { IResidenceRepository } from '../../domain/residence.repository.interface';

@Injectable()
export class CreateRequestCommandHandler {
  constructor(
    private readonly leadRepository: ILeadRepository,
    private readonly requestRepository: IRequestRepository,
    private readonly createLeadHandler: CreateLeadCommandHandler,
    private readonly updateLeadCommandHandler: UpdateLeadCommandHandler,
    private readonly residenceRepository: IResidenceRepository,
    private readonly emailQueue: EmailQueue,
    private readonly configService: ConfigService
  ) {}

  async handle(command: CreateRequestCommand): Promise<Request> {
    if (!command.termsAccepted) {
      throw new BadRequestException('Terms and conditions must be accepted!');
    }

    let lead = await this.leadRepository.findByEmail(command.email);

    if (!lead) {
      const leadCommand = new CreateLeadCommand(
        command.firstName,
        command.lastName,
        command.email,
        command.phoneNumber,
        command.preferredContactMethod
      );
      lead = await this.createLeadHandler.handle(leadCommand);
    } else {
      const updateLeadCommand = new UpdateLeadCommand(
        lead.id,
        command.firstName,
        command.lastName,
        command.email,
        command.phoneNumber,
        command.preferredContactMethod
      );
      lead = await this.updateLeadCommandHandler.handle(updateLeadCommand);
    }

    const requestData: Partial<Request> = {
      lead: lead,
      type: command.type,
      subject: command.subject,
      entityId: command.entityId,
      message: command.message,
      status: RequestStatusEnum.NEW,
    };

    const request = await this.requestRepository.create(requestData);

    if (!request) {
      throw new InternalServerErrorException('Failed to create request');
    }

    const residence = await this.residenceRepository.findById(command.entityId);

    const mapRequestType = {
      [RequestTypeEnum.CONSULTATION]: EmailAction.CONTACT_CONSULTATION,
      [RequestTypeEnum.MORE_INFORMATION]: EmailAction.REQUEST_INFORMATION,
      [RequestTypeEnum.CONTACT_US]: EmailAction.CONTACT_US,
    };

    // * Send Email to Sender
    await this.emailQueue.addEmailJob(mapRequestType[command.type], {
      to: command.email,
      variables: {
        fullName: `${command.firstName} ${command.lastName}`,
        residenceName: `${residence && residence.name}`,
        exploreMoreResidencesLink: `${this.configService.get<string>('FRONTEND_URL')}/residences`,
      },
    });

    return request;
  }
}
