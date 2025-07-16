import { Injectable, NotFoundException } from '@nestjs/common';
import { IKeyFeatureRepository } from '../../domain/key-feature.repository.interface';
import { KeyFeature } from '../../domain/key-feature.entity';

@Injectable()
export class FindByIdKeyFeatureQueryHandler {
  constructor(private readonly keyFeatureRepository: IKeyFeatureRepository) {}

  async handle(id: string): Promise<KeyFeature> {
    const existingKeyFeature = await this.keyFeatureRepository.findById(id);

    if (!existingKeyFeature) {
      throw new NotFoundException(`Key feature not found`);
    }

    return existingKeyFeature;
  }
}
