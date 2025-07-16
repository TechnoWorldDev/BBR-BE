import { KeyFeature } from '../../domain/key-feature.entity';
import { KeyFeatureResponse } from '../response/key-feature.response';

export class KeyFeatureMapper {
  static toResponse(keyFeature: KeyFeature): KeyFeatureResponse {
    return new KeyFeatureResponse(
      keyFeature.id,
      keyFeature.name,
      keyFeature.createdAt,
      keyFeature.updatedAt
    );
  }
}
