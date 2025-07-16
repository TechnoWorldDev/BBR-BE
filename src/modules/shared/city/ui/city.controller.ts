import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CityResponse } from './response/city.response';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';

import { City } from '../domain/city.entity';
import { CountryResponse } from './response/country.response';

import { Country } from '../domain/country.entity';
import { FindCityByIdCommandQuery } from '../application/query/find-city-by-id.command.query';
import { FetchCitiesCommandQuery } from '../application/query/fetch-cities.command.query';
import { CreateCityCommandHandler } from '../application/handler/create-city-command.handler';
import { UpdateCityCommandHandler } from '../application/handler/update-city.command.handler';
import { DeleteCityCommandHandler } from '../application/handler/delete-city.command.handler';
import { FetchCitiesQuery } from '../application/commands/fetch-cities.query';
import { CreateCityCommand } from '../application/commands/create-city.command';
import { CreateCityRequest } from './request/create-city.request';
import { UpdateCityRequest } from './request/update-city.request';
import { UpdateCityCommand } from '../application/commands/update-city.command';
import { OrderByDirection } from 'objection';
import { CityMapper } from './mapper/city.mapper';

@ApiTags('Cities')
@Controller('cities')
export class CityController {
  constructor(
    private readonly findCityByIdCommandQuery: FindCityByIdCommandQuery,
    private readonly fetchCitiesCommandQuery: FetchCitiesCommandQuery,
    private readonly createCityCommandHandler: CreateCityCommandHandler,
    private readonly updateCityCommandHandler: UpdateCityCommandHandler,
    private readonly deleteCityCommandHandler: DeleteCityCommandHandler
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
  @ApiResponse({ status: 200, description: 'List of cities', type: [CityResponse] })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('countryId') countryId?: string
  ): Promise<{ data: CityResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchCitiesQuery(query, page, limit, sortBy, sortOrder, countryId);
    const cities = await this.fetchCitiesCommandQuery.handler(fetchQuery);
    return {
      data: cities.data.map((city) => CityMapper.mapToResponse(city)),
      pagination: cities.pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a city by ID' })
  @ApiResponse({ status: 200, description: 'City details', type: CityResponse })
  async findOne(@Param('id') id: string): Promise<CityResponse> {
    const city = await this.findCityByIdCommandQuery.handle(id);
    return CityMapper.mapToResponse(city);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new city' })
  @ApiResponse({ status: 201, description: 'City created', type: CityResponse })
  async create(@Body() request: CreateCityRequest): Promise<CityResponse> {
    const command = new CreateCityCommand(
      request.name,
      request.asciiName,
      request.countryId,
      request.population,
      request.timezone,
      request.xCoordinate,
      request.yCoordinate
    );

    const city = await this.createCityCommandHandler.handle(command);
    return CityMapper.mapToResponse(city);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a city' })
  @ApiResponse({ status: 200, description: 'City updated', type: CityResponse })
  async update(@Param('id') id: string, @Body() request: UpdateCityRequest): Promise<CityResponse> {
    const command = new UpdateCityCommand(
      id,
      request.name,
      request.asciiName,
      request.countryId,
      request.population,
      request.timezone,
      request.xCoordinate,
      request.yCoordinate
    );

    const city = await this.updateCityCommandHandler.handle(command);
    return CityMapper.mapToResponse(city);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a city' })
  @ApiResponse({ status: 204, description: 'City deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteCityCommandHandler.handle(id);
  }


}
