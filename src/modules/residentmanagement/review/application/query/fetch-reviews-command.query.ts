import { Injectable } from '@nestjs/common';
import { Review } from '../../domain/review.entity';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { IReviewRepository } from '../../domain/ireview.repository.interface';
import { FetchReviewsQuery } from '../command/fetch-reviews.query';

@Injectable()
export class FetchReviewsCommandQuery {
  constructor(
    private readonly reviewRepository: IReviewRepository
  ) {}

  async handle(query: FetchReviewsQuery): Promise<{ data: Review[]; pagination: PaginationResponse }> {
    const result = await this.reviewRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
