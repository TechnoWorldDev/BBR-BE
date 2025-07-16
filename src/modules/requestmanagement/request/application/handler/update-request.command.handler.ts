import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { IRequestRepository } from '../../domain/irequest.repository.interface';
import { Request } from '../../domain/request.entity';
import { UpdateRequestCommand } from '../command/update-request.command';

@Injectable()
export class UpdateRequestCommandHandler {
  constructor(
    private readonly requestRepository: IRequestRepository,
  ) {}

  async handle(command: UpdateRequestCommand): Promise<Request> {
    const { id, note, status } = command;

    const request = await this.requestRepository.findById(id);
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    const requestData: Partial<Request> = {
      lead: request.lead,
      type: request.type,
      subject: request.subject,
      message: request.message,
      entityId: request.entityId,
      status: command.status,
      note: command.note,
    };

    const updatedRequest = await this.requestRepository.update(request.id, requestData);

    if (!updatedRequest) {
      throw new InternalServerErrorException('Request status could not be updated');
    }

    return updatedRequest;
  }
}
