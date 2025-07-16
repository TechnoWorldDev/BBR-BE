import { Injectable, NotFoundException } from '@nestjs/common';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { Residence } from '../../domain/residence.entity';

@Injectable()
export class FindBySlugResidenceCommandQuery {
  constructor(private readonly residenceRepository: IResidenceRepository) {}

  async handle(slug: string): Promise<Residence> {
    const residence = await this.residenceRepository.findBySlug(slug);

    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    return residence;
  }
}
