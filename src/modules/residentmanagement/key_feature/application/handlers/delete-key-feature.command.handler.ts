import { Injectable, NotFoundException } from '@nestjs/common';
import { IKeyFeatureRepository } from '../../domain/key-feature.repository.interface';

@Injectable()
export class DeleteKeyFeatureCommandHandler {
  constructor(private readonly keyFeatureRepository: IKeyFeatureRepository) {}

  async handle(id: string): Promise<void> {
    const existingKeyFeature = await this.keyFeatureRepository.findById(id);

    if (!existingKeyFeature) {
      throw new NotFoundException(`Key feature not found`);
    }

    await this.keyFeatureRepository.delete(id);
  }
}
