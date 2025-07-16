import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { IKeyFeatureRepository } from '../../domain/key-feature.repository.interface';
import { CreateKeyFeatureCommand } from '../commands/create-key-feature.command';
import { KeyFeature } from '../../domain/key-feature.entity';

@Injectable()
export class CreateKeyFeatureCommandHandler {
  constructor(private readonly keyFeatureRepository: IKeyFeatureRepository) {}

  async handle(command: CreateKeyFeatureCommand): Promise<KeyFeature> {
    const existingKeyFeature = await this.keyFeatureRepository.findByName(command.name);

    if (existingKeyFeature) {
      throw new ConflictException(`Key feature with name ${command.name} already exist`);
    }

    const createdKeyFeature = await this.keyFeatureRepository.create({ name: command.name });

    if (!createdKeyFeature) {
      throw new InternalServerErrorException('Key feature not created');
    }

    return createdKeyFeature;
  }
}
