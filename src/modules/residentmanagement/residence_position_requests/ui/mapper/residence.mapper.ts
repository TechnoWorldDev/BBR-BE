import { Residence } from '../../domain/residence.entity';
import { ResidenceResponse } from '../response/residence.response';

export class ResidenceMapper {
  static toResponse(residence: Residence): ResidenceResponse {
    return new ResidenceResponse(residence.id, residence.name, residence.slug);
  }
}
