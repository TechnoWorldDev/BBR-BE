import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Residence } from './residence.entity';

export abstract class IResidenceRepository {
  abstract findByCriteria(criteria: any): Promise<Residence[]>;
}
