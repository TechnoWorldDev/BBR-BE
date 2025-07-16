import { Unit } from './unit.entity';
import { FetchUnitsQuery } from '../application/command/fetch-units.query';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';

export abstract class IUnitRepository {
  abstract create(unit: Partial<Unit>): Promise<Unit | undefined>;
  abstract findById(id: string): Promise<Unit | undefined>;
  abstract findOwnById(companyId: string, id: string): Promise<Unit | undefined>;
  abstract findBySlug(slug: string): Promise<Unit | undefined>;
  abstract findAll(
    query: FetchUnitsQuery
  ): Promise<{ data: Unit[]; pagination: PaginationResponse }>;
  abstract update(id: string, data: Partial<Unit>): Promise<Unit | undefined>;
  abstract softDelete(id: string): Promise<void>;
}
