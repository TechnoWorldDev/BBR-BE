import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IKeyFeatureRepository } from '../../domain/key-feature.repository.interface';
import { UpdateKeyFeatureCommand } from '../commands/update-key-feature.command';
import { KeyFeature } from '../../domain/key-feature.entity';

@Injectable()
export class UpdateKeyFeatureCommandHandler {
  constructor(private readonly keyFeatureRepository: IKeyFeatureRepository) {}

  async handle(command: UpdateKeyFeatureCommand): Promise<KeyFeature> {
    const existingKeyFeature = await this.keyFeatureRepository.findById(command.id);

    if (!existingKeyFeature) {
      throw new NotFoundException(`Key feature not found`);
    }

    const existingKeyFeatureByName = await this.keyFeatureRepository.findByName(command.name ?? '');

    if (existingKeyFeatureByName && existingKeyFeatureByName.id !== command.id) {
      throw new ConflictException(`Key feature with this name already exists`);
    }

    const updatedKeyFeature = await this.keyFeatureRepository.update(command.id, {
      name: command.name,
    });

    if (!updatedKeyFeature) {
      throw new InternalServerErrorException(`Key feature not updated`);
    }

    return updatedKeyFeature;
  }
}
