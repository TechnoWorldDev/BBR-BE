import { Injectable, NotFoundException } from '@nestjs/common';
import { IResidenceRepository } from '../../domain/residence.repository.interface';

@Injectable()
export class DeleteResidenceCommandHandler {
  constructor(private readonly residenceRepository: IResidenceRepository) {}

  async handle(id: string) {
    const residence = await this.residenceRepository.findById(id);

    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    return await this.residenceRepository.delete(id);
  }
}
