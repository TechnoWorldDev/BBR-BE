import { Injectable } from '@nestjs/common';
import { UnitType } from '../domain/unit_type.entity';
import { IUnitTypeRepository } from '../domain/unit-type.repository.interface';

@Injectable()
export class UnitTypeRepositoryImpl implements IUnitTypeRepository{
  async findById(id: string): Promise<UnitType | undefined> {
    return await UnitType.query()
      .findById(id)
      .whereNull('deletedAt');
  }
}
