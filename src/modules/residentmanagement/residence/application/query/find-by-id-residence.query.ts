import { Injectable, NotFoundException } from '@nestjs/common';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { Residence } from '../../domain/residence.entity';

@Injectable()
export class FindByIdResidenceCommandQuery {
  constructor(private readonly residenceRepository: IResidenceRepository) {}

  async handle(id: string): Promise<Residence> {
    const residence = await this.residenceRepository.findById(id);

    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    return residence;
  }
}
