import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { IRequestRepository } from '../../domain/irequest.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { UpdateRequestStatusCommand } from '../command/update-request-status.command';
import { Request } from '../../domain/request.entity';

@Injectable()
export class UpdateRequestStatusCommandHandler {
  constructor(private readonly requestRepository: IRequestRepository) {}

  @LogMethod()
  async handle(command: UpdateRequestStatusCommand): Promise<Request> {
    const request = await this.requestRepository.findById(command.id);
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    const requestData: Partial<Request> = {
      lead: request.lead,
      type: request.type,
      subject: request.subject,
      message: request.message,
      status: command.status,
    };

    const updatedRequest = await this.requestRepository.update(command.id,requestData);

    if (!updatedRequest) {
      throw new InternalServerErrorException('Request status could not be updated');
    }

    return updatedRequest;
  }
}
