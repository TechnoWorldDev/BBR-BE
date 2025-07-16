import { Residence } from '../domain/residence.entity';

export abstract class IResidenceRepository {
  abstract findById(id: string): Promise<Residence | undefined>;
}
