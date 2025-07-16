import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderByDirection } from 'objection';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchBrandsQuery } from '../application/command/fetch-brands.query';
import { FetchAllBrandQueryHandler } from '../application/query/fetch-all-brands.query.handler';
import { FindByIdBrandQueryHandler } from '../application/query/find-by-id-brand.query.handler';
import { BrandStatus } from '../domain/brand-status.enum';
import { BrandMapper } from './mappers/brand.mapper';
import { BrandResponse } from './response/brand-response';
import { FindBySlugBrandQueryHandler } from '../application/query/find-by-slug-brand.query.handler';
import { FetchAllBrandPublicQueryHandler } from '../application/query/fetch-all-brands.public.query.handler';
import { FetchBrandsPublicQuery } from '../application/command/fetch-brands.public.query';

@ApiTags('brands')
@Controller('public/brands')
export class BrandPublicController {
  constructor(
    private readonly findByIdBrandHandler: FindByIdBrandQueryHandler,
    private readonly fetchAllBrandPublicHandler: FetchAllBrandPublicQueryHandler,
    private readonly findBySlugBrandQueryHandler: FindBySlugBrandQueryHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all brands' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({ status: 200, description: 'List of brands', type: [BrandResponse] })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('withResidences') withResidences?: boolean,
    @Query('brandTypeId') brandTypeId?: string[]
  ): Promise<{ data: BrandResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchBrandsPublicQuery(
      query,
      page,
      limit,
      sortBy,
      sortOrder,
      [BrandStatus.ACTIVE],
      withResidences,
      brandTypeId
    );

    const { data, pagination } = await this.fetchAllBrandPublicHandler.handle(fetchQuery);

    return {
      data: data.map((brand) => BrandMapper.toPublicResponse(brand)),
      pagination,
    };
  }

  // @Get('with-residences')
  // @ApiOperation({ summary: 'Fetch all brands' })
  // @ApiQuery({
  //   name: 'page',
  //   required: false,
  //   type: Number,
  //   description: 'Page number (default: 1)',
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   required: false,
  //   type: Number,
  //   description: 'Items per page (default: 10)',
  // })
  // @ApiResponse({ status: 200, description: 'List of brands', type: [BrandResponse] })
  // async findAllPublic(
  //   @Query('query') query?: string,
  //   @Query('page') page?: number,
  //   @Query('limit') limit?: number,
  //   @Query('sortBy') sortBy?: string,
  //   @Query('sortOrder') sortOrder?: OrderByDirection,
  //   @Query('brandTypeId') brandTypeId?: string[]
  // ): Promise<{ data: BrandResponse[]; pagination: PaginationResponse }> {
  //   const fetchQuery = new FetchBrandsQuery(
  //     query,
  //     page,
  //     limit,
  //     sortBy,
  //     sortOrder,
  //     [BrandStatus.ACTIVE],
  //     brandTypeId
  //   );
  //   const { data, pagination } = await this.fetchAllBrandHandler.handle(fetchQuery);

  //   return {
  //     data: data.map((brand) => BrandMapper.toPublicResponse(brand)),
  //     pagination,
  //   };
  // }

  @Get('/slug/:slug')
  @ApiOperation({ summary: 'Fetch a brand by slug' })
  @ApiResponse({ status: 200, description: 'Brand found', type: BrandResponse })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async findBySlug(@Param('slug') slug: string): Promise<BrandResponse> {
    const brand = await this.findBySlugBrandQueryHandler.handle(slug);
    return BrandMapper.toPublicResponse(brand);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand found', type: BrandResponse })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async findOne(@Param('id') id: string): Promise<BrandResponse> {
    const brand = await this.findByIdBrandHandler.handle(id);
    return BrandMapper.toPublicResponse(brand);
  }
}
