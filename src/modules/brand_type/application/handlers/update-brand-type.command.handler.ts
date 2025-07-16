import { Injectable } from '@nestjs/common';
import { UpdateBrandTypeCommand } from '../command/update-brand-type.command';
import { IBrandTypesRepository } from '../../domain/brand-type.repository.interface';

@Injectable()
export class UpdateBrandTypeCommandHandler {
  constructor(private readonly brandTypesRepository: IBrandTypesRepository) {}

  async handle(command: UpdateBrandTypeCommand) {
    const existingBrandType = await this.brandTypesRepository.findById(command.id);

    if (!existingBrandType) {
      throw new Error('Brand type not found');
    }

    const existingBrandTypeByName = await this.brandTypesRepository.findByName(
      command.name ? command.name : ''
    );

    if (existingBrandTypeByName && existingBrandTypeByName.id !== command.id) {
      throw new Error('Brand type with this name already exists');
    }

    return await this.brandTypesRepository.update(command.id, {
      name: command.name,
      description: command.description,
    });
  }
}
