import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';

import { OrderByDirection } from 'objection';
import { FetchCitiesQuery } from '../application/commands/fetch-cities.query';
import { FetchCitiesCommandQuery } from '../application/query/fetch-cities.command.query';
import { FindCityByIdCommandQuery } from '../application/query/find-city-by-id.command.query';
import { CityMapper } from './mapper/city.mapper';
import { CityPublicResponse } from './response/city.public.response';
import { FetchCitiesPublicCommandQuery } from '../application/query/fetch-cities.public.command.query';

@ApiTags('Cities')
@Controller('public/cities')
export class CityPublicController {
  constructor(
    private readonly findCityByIdCommandQuery: FindCityByIdCommandQuery,
    private readonly fetchCitiesPublicCommandQuery: FetchCitiesPublicCommandQuery
  ) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all cities' })
  @ApiQuery({
    name: 'query',
    required: false,
    type: String,
    description: 'Search query for city name',
  })
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
  @ApiResponse({ status: 200, description: 'List of cities', type: [CityPublicResponse] })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection
  ): Promise<{ data: CityPublicResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchCitiesQuery(query, page, limit, sortBy, sortOrder);
    const cities = await this.fetchCitiesPublicCommandQuery.handler(fetchQuery);
    return {
      data: cities.data.map((city) => CityMapper.mapToPublicResponse(city)),
      pagination: cities.pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a city by ID' })
  @ApiResponse({ status: 200, description: 'City details', type: CityPublicResponse })
  async findOne(@Param('id') id: string): Promise<CityPublicResponse> {
    const city = await this.findCityByIdCommandQuery.handle(id);
    return CityMapper.mapToPublicResponse(city);
  }
}
