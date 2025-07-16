import { Unit } from './unit.entity';

export abstract class IUnitRepository {
  abstract findById(id: string): Promise<Unit | undefined>;
}
