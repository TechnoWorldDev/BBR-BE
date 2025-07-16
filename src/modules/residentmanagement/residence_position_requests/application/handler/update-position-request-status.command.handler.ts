import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ResidencePositionRequestStatusEnum } from 'src/shared/types/residence-position-requests.enum';
import { IResidencePositionRequestsRepository } from '../../domain/residence-position-requests.repository.interface';
import { ResidencePositionRequest } from '../../domain/residence-position-requests.entity';
import { UpdatePositionRequestStatusCommand } from '../command/update-position-request.command';

@Injectable()
export class UpdatePositionRequestStatusCommandHandler {
  constructor(private readonly positionRequestRepository: IResidencePositionRequestsRepository) {}

  async handle(command: UpdatePositionRequestStatusCommand): Promise<ResidencePositionRequest> {
    const positionRequest = await this.positionRequestRepository.findById(command.id);

    if (!positionRequest) {
      throw new NotFoundException('Position request not found');
    }

    if (positionRequest.status === command.status) {
      throw new ConflictException('Position request status already updated');
    }

    const updated = await this.positionRequestRepository.update(command.id, {
      status: command.status,
    });

    if (!updated) {
      throw new InternalServerErrorException('Position request not updated');
    }

    return updated;
  }
}
