import { Injectable } from '@nestjs/common';
import { KnexService } from '../../../../shared/infrastructure/database/knex.service';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { applyPagination } from '../../../../shared/utils/pagination.util';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { applyFilters } from '../../../../shared/filters/query.dynamic-filters';
import { IReviewRepository } from '../domain/ireview.repository.interface';
import { Review } from '../domain/review.entity';
import { FetchReviewsQuery } from '../application/command/fetch-reviews.query';

@Injectable()
export class ReviewRepositoryImpl implements IReviewRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(data: Partial<Review>): Promise<Review | undefined> {
    const reviewData = {
      residenceId: data.residence?.id,
      userId: data.user?.id,
      dateOfPurchase: data.dateOfPurchase,
      unitTypeId: data.unitType?.id,
      isPrimaryResidence: data.isPrimaryResidence,
      verifiedOwnerOrTenant: data.verifiedOwnerOrTenant,
      buildQuality: data.buildQuality,
      purchaseExperienceRating: data.purchaseExperienceRating,
      amenities: data.amenities,
      neighbourhoodLocation: data.neighbourhoodLocation,
      valueForMoney: data.valueForMoney,
      serviceQuality: data.serviceQuality,
      additionalFeedback: data.additionalFeedback,
      status: data.status,
    };

    const knex = this.knexService.connection;

    const insertedReview = await knex('reviews').insert(reviewData).returning('*');

    return this.findById(insertedReview[0].id);
  }

  async findById(id: string): Promise<Review | undefined> {
    return Review.query()
      .findById(id)
      .whereNull('deletedAt')
      .withGraphFetched('[residence, user, unitType]');
  }

  async findOwnById(companyId: string, id: string): Promise<Review | undefined> {
    return Review.query()
      .findById(id)
      .whereNull('reviews.deletedAt')
      .joinRelated('residence')
      .where('residence.companyId', companyId)
      .withGraphFetched('[residence, user, unitType]');
  }

  async findAll(
    query: FetchReviewsQuery
  ): Promise<{ data: Review[]; pagination: PaginationResponse }> {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      searchQuery,
      status,
      residenceId,
      userId,
      unitTypeId,
      companyId,
    } = query;

    const columnsToSearchAndSort = ['status'];

    let reviewQuery = Review.query()
      .modify((qb) =>
        applyFilters(qb, { status, residenceId, userId, unitTypeId }, Review.tableName)
      )
      .whereNull('reviews.deletedAt')
      .withGraphFetched('[residence, user, unitType]');

    reviewQuery = applySearchFilter(reviewQuery, searchQuery, columnsToSearchAndSort);

    if (companyId) {
      reviewQuery = reviewQuery.joinRelated('residence').where('residence.companyId', companyId);
    }

    if (sortBy && sortOrder) {
      if (columnsToSearchAndSort.includes(sortBy)) {
        reviewQuery = reviewQuery.orderBy(sortBy, sortOrder);
      }
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      reviewQuery,
      page,
      limit
    );

    return {
      data: paginatedQuery,
      pagination: {
        total: totalCount,
        totalPages,
        page: page,
        limit: limit,
      },
    };
  }

  async update(id: string, data: Partial<Review>): Promise<Review | undefined> {
    await Review.query().patchAndFetchById(id, data);

    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    const knex = this.knexService.connection;

    await Review.query().patch({ deletedAt: new Date() }).where('id', id).whereNull('deletedAt');
  }
}
