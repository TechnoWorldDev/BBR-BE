import { Unit } from '../domain/unit.entity';
import { IUnitRepository } from '../domain/unit.repository.interface';

export class UnitRepositoryImpl implements IUnitRepository {
  constructor() {}

  async findById(id: string): Promise<Unit | undefined> {
    return Unit.query().findById(id).whereNull('deletedAt');
  }
}
