import { Request } from './request.entity';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { FetchRequestsQuery } from '../application/command/fetch-requests.query';

export abstract class IRequestRepository {
  abstract create(data: Partial<Request>): Promise<Request | undefined>;

  abstract findById(id: string): Promise<Request | undefined>;

  abstract findOwnById(companyId: string, id: string): Promise<Request | undefined>;

  abstract findAll(
    query: FetchRequestsQuery
  ): Promise<{ data: Request[]; pagination: PaginationResponse }>;

  abstract update(id: string, data: Partial<Request>): Promise<Request | undefined>;

  abstract softDelete(id: string): Promise<void>;
}
