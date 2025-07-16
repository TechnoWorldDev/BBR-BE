import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderByDirection } from 'objection';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { ResidenceStatusEnum } from '../domain/residence-status.enum';
import { ResidenceMapper } from './mappers/residence.mapper';
import { ResidenceResponse } from './response/residence.response';
import { FetchResidencesQuery } from '../application/commands/fetch-residences.query';
import { FindAllResidencesCommandQuery } from '../application/query/find-all-residences.query';
import { FindByIdResidenceCommandQuery } from '../application/query/find-by-id-residence.query';
import { ResidencePublicResponse } from './response/residence.public.response';
import { FindBySlugResidenceCommandQuery } from '../application/query/find-by-slug-residence.query';
import { DevelopmentStatusEnum } from 'src/shared/types/development-status.enum';

ApiTags('Residence');
@Controller('public/residences')
export class ResidencePublicController {
  constructor(
    private readonly findAllResidencesCommandQuery: FindAllResidencesCommandQuery,
    private readonly findByIdResidenceCommandQuery: FindByIdResidenceCommandQuery,
    private readonly findBySlugResidenceCommandQuery: FindBySlugResidenceCommandQuery
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all residences' })
  @ApiResponse({
    status: 200,
    description: 'List of residences',
    type: ResidenceResponse,
    isArray: true,
  })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('developmentStatus') developmentStatus?: DevelopmentStatusEnum[],
    @Query('cityId') cityId?: string[],
    @Query('countryId') countryId?: string[],
    @Query('brandId') brandId?: string[],
    @Query('address') address?: string[],
    @Query('continentId') continentId?: string[]
  ): Promise<{ data: ResidencePublicResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchResidencesQuery(
      query,
      page,
      limit,
      sortBy,
      sortOrder,
      [ResidenceStatusEnum.ACTIVE],
      developmentStatus,
      cityId,
      countryId,
      brandId,
      address,
      continentId
    );

    const { data, pagination } = await this.findAllResidencesCommandQuery.handle(fetchQuery);

    return {
      data: data.map((residence) => ResidenceMapper.toPublicResponse(residence)),
      pagination,
    };
  }

  @Get('/slug/:slug')
  @ApiOperation({ summary: 'Get a residence by slug' })
  @ApiResponse({ status: 200, description: 'Residence found', type: ResidenceResponse })
  async findBySlug(@Param('slug') slug: string): Promise<ResidencePublicResponse> {
    const residence = await this.findBySlugResidenceCommandQuery.handle(slug);
    return ResidenceMapper.toPublicResponse(residence);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a residence by id' })
  @ApiResponse({ status: 200, description: 'Residence found', type: ResidenceResponse })
  async findById(@Param('id') id: string): Promise<ResidencePublicResponse> {
    const residence = await this.findByIdResidenceCommandQuery.handle(id);
    return ResidenceMapper.toPublicResponse(residence);
  }
}
