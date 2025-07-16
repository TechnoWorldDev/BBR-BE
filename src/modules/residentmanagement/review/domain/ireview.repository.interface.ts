import { Review } from './review.entity';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { FetchReviewsQuery } from '../application/command/fetch-reviews.query';

export abstract class IReviewRepository {
  abstract create(data: Partial<Review>): Promise<Review | undefined>;

  abstract findById(id: string): Promise<Review | undefined>;

  abstract findOwnById(companyId: string, id: string): Promise<Review | undefined>;

  abstract findAll(
    query: FetchReviewsQuery
  ): Promise<{ data: Review[]; pagination: PaginationResponse }>;

  abstract update(id: string, data: Partial<Review>): Promise<Review | undefined>;

  abstract softDelete(id: string): Promise<void>;
}
