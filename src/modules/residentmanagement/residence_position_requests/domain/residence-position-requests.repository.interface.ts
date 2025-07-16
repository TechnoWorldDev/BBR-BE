import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { ResidencePositionRequest } from './residence-position-requests.entity';
import { FetchPositionRequestsQuery } from '../application/command/fetch-position-requests.query';

export abstract class IResidencePositionRequestsRepository {
  abstract create(
    residencePositionRequest: Partial<ResidencePositionRequest>
  ): Promise<ResidencePositionRequest | undefined>;

  abstract delete(id: string): Promise<void>;

  abstract update(
    id: string,
    data: Partial<ResidencePositionRequest>
  ): Promise<ResidencePositionRequest | undefined>;

  abstract findAll(
    query: FetchPositionRequestsQuery
  ): Promise<{ data: ResidencePositionRequest[]; pagination: PaginationResponse }>;

  abstract findById(id: string): Promise<ResidencePositionRequest | undefined>;
}
