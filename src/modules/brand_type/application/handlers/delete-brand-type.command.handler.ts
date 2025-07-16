import { Injectable } from '@nestjs/common';
import { IBrandTypesRepository } from '../../domain/brand-type.repository.interface';
import { DeleteBrandTypeCommand } from '../command/delete-brand-type.command';

@Injectable()
export class DeleteBrandTypeCommandHandler {
  constructor(private readonly brandTypesRepository: IBrandTypesRepository) {}
  async handle(command: DeleteBrandTypeCommand) {
    const existingBrandType = await this.brandTypesRepository.findById(command.id);

    if (!existingBrandType) {
      throw new Error('Brand type not found');
    }

    this.brandTypesRepository.delete(command.id);
  }
}
