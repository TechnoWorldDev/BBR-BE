import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UnitStatusEnum } from '../../domain/unit-status.enum';
import { IUnitRepository } from '../../domain/unit.repository.interface';
import { UpdateUnitStatusCommand } from '../command/update-unit-status.command';

@Injectable()
export class UpdateUnitStatusCommandHandler {
  constructor(private readonly unitRespository: IUnitRepository) {}

  async handle(command: UpdateUnitStatusCommand) {
    const existingUnit = await this.unitRespository.findById(command.id);
    if (!existingUnit) {
      throw new NotFoundException('Unit not found');
    }

    const updated = await this.unitRespository.update(command.id, {
      status: command.status as UnitStatusEnum,
    });

    if (!updated) {
      throw new InternalServerErrorException('Failed to update unit status');
    }
  }
}
