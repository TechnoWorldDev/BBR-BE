import { Lifestyle } from '../../domain/lifestyle.entity';
import { LifestyleResponse } from '../response/lifestyle.response';

export class LifestyleMapper {
  static toResponse(lifestyle: Lifestyle): LifestyleResponse {
    return new LifestyleResponse(
      lifestyle.id,
      lifestyle.name,
      lifestyle.createdAt,
      lifestyle.updatedAt,
      lifestyle.order
    );
  }
}
