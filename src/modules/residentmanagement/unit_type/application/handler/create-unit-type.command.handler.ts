import { Injectable } from '@nestjs/common';
import { CreateUnitTypeCommand } from '../commands/create-unit-type.command';
import { IUnitTypeRepository } from '../../domain/unit-type.repository.interface';

@Injectable()
export class CreateUnitTypeCommandHandler {
  constructor(private readonly unitTypeRepository: IUnitTypeRepository) {}

  async handle(command: CreateUnitTypeCommand) {
    const existingUnitType = await this.unitTypeRepository.findByName(command.name);

    if (existingUnitType) {
      throw new Error('Unit type already exists');
    }

    const unitType = this.unitTypeRepository.create({ name: command.name });

    if (!unitType) {
      throw new Error('Unit type can not be created');
    }

    return unitType;
  }
}
