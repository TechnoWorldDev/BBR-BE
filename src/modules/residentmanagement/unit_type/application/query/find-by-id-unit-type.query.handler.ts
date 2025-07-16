import { Injectable, NotFoundException } from '@nestjs/common';
import { IUnitTypeRepository } from '../../domain/unit-type.repository.interface';
import { FindByIdUnitTypeQuery } from '../commands/find-by-id-unit-type.query';
import { UnitType } from '../../domain/unit_type.entity';

@Injectable()
export class FindByIdUnitTypeQueryHandler {
  constructor(private readonly unitTypeRepository: IUnitTypeRepository) {}

  async handle(query: FindByIdUnitTypeQuery): Promise<UnitType> {
    const unitType = await this.unitTypeRepository.findById(query.id);

    if (!unitType) {
      throw new NotFoundException('Unit type not found');
    }

    return unitType;
  }
}
