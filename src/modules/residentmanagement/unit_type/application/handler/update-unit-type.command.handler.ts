import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IUnitTypeRepository } from '../../domain/unit-type.repository.interface';
import { UpdateUnitTypeCommand } from '../commands/update-unit-type.command';

@Injectable()
export class UpdateUnitTypeCommandHandler {
  constructor(private readonly unitTypeRepository: IUnitTypeRepository) {}

  async handle(command: UpdateUnitTypeCommand) {
    const existingUnitType = await this.unitTypeRepository.findById(command.id);

    if (!existingUnitType) {
      throw new NotFoundException('Unit type not found');
    }

    const existingUnitTypeName = await this.unitTypeRepository.findByName(command.name ?? '');

    if (existingUnitTypeName && existingUnitTypeName.id !== command.id) {
      throw new ConflictException('Unit type with this name already exists');
    }

    const updatedUnitType = await this.unitTypeRepository.update(command.id, {
      name: command.name,
    });

    if (!updatedUnitType) {
      throw new InternalServerErrorException('Unit type not updated');
    }

    return updatedUnitType;
  }
}
