import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { UnitType } from './unit_type.entity';
import { FetchUnitTypeQuery } from '../application/commands/fetch-unit-type.query';

export abstract class IUnitTypeRepository {
  abstract findAll(
    query: FetchUnitTypeQuery
  ): Promise<{ data: UnitType[]; pagination: PaginationResponse }>;
  abstract findByName(name: string):  Promise<UnitType | undefined>;
  abstract findById(id: string): Promise<UnitType | undefined>;
  abstract create(unitType: Partial<UnitType>): Promise<UnitType>;
  abstract update(id: string, data: Partial<UnitType>): Promise<UnitType>;
  abstract delete(id: string): Promise<void>;
}
