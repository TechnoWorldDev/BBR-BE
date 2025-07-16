import { Injectable, NotFoundException } from '@nestjs/common';
import { IUnitTypeRepository } from '../../domain/unit-type.repository.interface';

@Injectable()
export class DeleteUnitTypeCommandHandler {
  constructor(private readonly unitTypeRepository: IUnitTypeRepository) {}

  async handle(id: string): Promise<void> {
    const unitType = await this.unitTypeRepository.findById(id);

    if (!unitType) {
      throw new NotFoundException('Unit type not found');
    }

    await this.unitTypeRepository.delete(id);
  }
}
