import { Injectable, NotFoundException } from '@nestjs/common';
import { ILeadRepository } from '../../domain/ilead.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class DeleteLeadCommandHandler {
  constructor(private readonly leadRepository: ILeadRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    await this.leadRepository.softDelete(id);
  }
}
