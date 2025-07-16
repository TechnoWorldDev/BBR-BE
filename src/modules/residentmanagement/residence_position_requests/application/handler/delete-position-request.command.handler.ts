import { Injectable, NotFoundException } from '@nestjs/common';
import { IResidencePositionRequestsRepository } from '../../domain/residence-position-requests.repository.interface';

@Injectable()
export class DeletePositionRequestCommandHandler {
  constructor(private readonly positionRequestRepository: IResidencePositionRequestsRepository) {}

  async handle(id: string) {
    const positionRequest = await this.positionRequestRepository.findById(id);

    if (!positionRequest) {
      throw new NotFoundException('Position request not found');
    }

    return await this.positionRequestRepository.delete(id);
  }
}
