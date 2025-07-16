import { UnitType } from './unit_type.entity';

export abstract class IUnitTypeRepository {

  abstract findById(id: string): Promise<UnitType | undefined>;

}
