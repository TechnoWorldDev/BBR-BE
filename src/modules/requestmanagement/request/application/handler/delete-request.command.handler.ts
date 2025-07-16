import { Injectable, NotFoundException } from '@nestjs/common';
import { IRequestRepository } from '../../domain/irequest.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class DeleteRequestCommandHandler {
  constructor(private readonly requestRepository: IRequestRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const request = await this.requestRepository.findById(id);
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    await this.requestRepository.softDelete(id);
  }
}
