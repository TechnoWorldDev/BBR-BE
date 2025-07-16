import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchKeyFeaturesQuery } from '../application/commands/fetch-key-features.query';
import { KeyFeature } from './key-feature.entity';

export abstract class IKeyFeatureRepository {
  abstract create(keyFeature: Partial<KeyFeature>): Promise<KeyFeature | undefined>;
  abstract update(id: string, data: Partial<KeyFeature>): Promise<KeyFeature | undefined>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<KeyFeature | undefined>;
  abstract findByName(name: string): Promise<KeyFeature | undefined>;
  abstract findAll(
    query: FetchKeyFeaturesQuery
  ): Promise<{ data: KeyFeature[]; pagination: PaginationResponse }>;
  abstract validateAndFetchByIds(ids: string[]): Promise<KeyFeature[]>;
}
