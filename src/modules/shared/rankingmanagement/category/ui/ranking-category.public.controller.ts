import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderByDirection } from 'objection';
import { FetchRankingCategoriesQuery } from '../application/command/fetch-ranking.categories.query';
import { FetchResidencesByCategoryCommandQuery } from '../application/query/fetch-residences-by-category.query';
import { RankingCategoryResponse } from './response/ranking-category.response';
import { RankingCategoryStatus } from '../domain/ranking-category-status.enum';
import { FetchRankingCategoriesCommandQuery } from '../application/query/fetch-ranking-categories.query';
import { RankingCategory } from '../domain/ranking-category.entity';
import { RankingCategoryMapper } from './mapper/ranking-category.mapper';
import { FetchResidencesByCategoryQuery } from '../application/command/fetch-residences-by-category.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';

@Controller('public/ranking-categories')
export class RankingCategoryPublicController {
  constructor(
    private readonly fetchResidencesByCategoryCommandQuery: FetchResidencesByCategoryCommandQuery,
    private readonly fetchRankingCategoriesCommandQuery: FetchRankingCategoriesCommandQuery
  ) {}

  @Get(':slug/residences')
  @ApiOperation({ summary: 'Get all ranking categories' })
  @ApiResponse({ type: [RankingCategoryResponse] })
  async fetchResidencesByCategory(
    @Param('slug') slug: string,
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('countryId') countryId?: string
  ): Promise<{ data: RankingCategoryResponse[]; pagination: PaginationResponse }> {
    const result = await this.fetchResidencesByCategoryCommandQuery.handle(
      slug,
      new FetchResidencesByCategoryQuery(
        query,
        page,
        limit,
        sortBy,
        sortOrder,
        countryId ? [countryId] : undefined
      )
    );
    const data = result.data as RankingCategoryResponse[];
    const pagination = result.pagination as PaginationResponse;

    return {
      data,
      pagination,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all ranking categories' })
  @ApiResponse({ type: [RankingCategoryResponse] })
  async fetchAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('categoryTypeId') categoryTypeId?: string[]
  ) {
    const { data, pagination } = await this.fetchRankingCategoriesCommandQuery.handle(
      new FetchRankingCategoriesQuery(
        query,
        page,
        limit,
        sortBy,
        sortOrder,
        [RankingCategoryStatus.ACTIVE],
        categoryTypeId
      )
    );

    const mappedRankingCategories = data.map((category: RankingCategory) =>
      RankingCategoryMapper.toPublicResponse(category)
    );

    return {
      data: mappedRankingCategories,
      pagination,
    };
  }

  @Get('/by-location')
  @ApiOperation({ summary: 'Get ranking categories by country and city' })
  @ApiResponse({ type: [RankingCategoryResponse] })
  async fetchByLocation(
    @Query('countryId') countryId?: string,
    @Query('cityId') cityId?: string,
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('categoryTypeId') categoryTypeId?: string[]
  ) {
    const { data, pagination } = await this.fetchRankingCategoriesCommandQuery.handle(
      new FetchRankingCategoriesQuery(
        query,
        page,
        limit,
        sortBy,
        sortOrder,
        [RankingCategoryStatus.ACTIVE],
        categoryTypeId,
        countryId,
        cityId
      )
    );

    const mappedRankingCategories = data.map((category: RankingCategory) =>
      RankingCategoryMapper.toPublicResponse(category)
    );

    return {
      data: mappedRankingCategories,
      pagination,
    };
  }

  @Get('/suggested')
  @ApiOperation({ summary: 'Get suggested ranking categories by country and city' })
  @ApiResponse({ type: [RankingCategoryResponse] })
  async getSuggestedCategories(
    @Query('countryId') countryId?: string,
    @Query('cityId') cityId?: string
  ) {
    // Directly access the repository via the query handler's repository
    // (or inject the repository if you prefer)
    const repo = (this.fetchRankingCategoriesCommandQuery as any).rankingCategoryRepository;
    const allowedKeys = [
      'test_ranking_category_type_lorem',
      'test_2',
      'brands',
      'continents',
      'unit_types',
      'countries',
      'Test',
      'lifestyles',
      'cities',
    ];

    let query = RankingCategory.query()
      .whereNull('ranking_categories.deleted_at')
      .joinRelated('rankingCategoryType')
      .withGraphFetched('[rankingCategoryType, featuredImage]')
      .whereIn('rankingCategoryType.key', allowedKeys);

    if (countryId || cityId) {
      query = query.where((qb) => {
        if (countryId && cityId) {
          qb.where((subQb) => {
            subQb
              .where('rankingCategoryType.key', '=', 'countries')
              .andWhere('entity_id', '=', countryId);
          }).orWhere((subQb) => {
            subQb
              .where('rankingCategoryType.key', '=', 'cities')
              .andWhere('entity_id', '=', cityId);
          });
        } else if (countryId && !cityId) {
          qb.where('rankingCategoryType.key', '=', 'countries').andWhere(
            'entity_id',
            '=',
            countryId
          );
        } else if (cityId && !countryId) {
          qb.where('rankingCategoryType.key', '=', 'cities').andWhere('entity_id', '=', cityId);
        }
      });
    }
    const categories = await query;
    const mapped = categories.map((category: RankingCategory) =>
      RankingCategoryMapper.toPublicResponse(category)
    );
    return { data: mapped };
  }
}
