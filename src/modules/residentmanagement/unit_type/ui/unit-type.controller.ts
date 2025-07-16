import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FetchCitiesQuery } from 'src/modules/shared/city/application/commands/fetch-cities.query';
import { CityResponse } from 'src/modules/shared/city/ui/response/city.response';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { UnitTypeResponse } from './response/unit-type.response';
import { FetchUnitTypesQueryHandler } from '../application/query/fetch-unit-types.query.handler';
import { FindByIdUnitTypeQueryHandler } from '../application/query/find-by-id-unit-type.query.handler';
import { CreateUnitTypeCommandHandler } from '../application/handler/create-unit-type.command.handler';
import { UpdateUnitTypeCommandHandler } from '../application/handler/update-unit-type.command.handler';
import { FetchUnitTypeQuery } from '../application/commands/fetch-unit-type.query';
import { FindByIdUnitTypeQuery } from '../application/commands/find-by-id-unit-type.query';
import { UpdateUnitTypeRequest } from './request/update-unit-type.request';
import { UpdateUnitTypeCommand } from '../application/commands/update-unit-type.command';
import { CreateUnitTypeCommand } from '../application/commands/create-unit-type.command';
import { CreateUnitTypeRequest } from './request/create-unit-type.request';
import { DeleteUnitTypeCommandHandler } from '../application/handler/delete-unit-type.command.handler';

@ApiTags('Unit Types')
@Controller('unit-types')
export class UnitTypeController {
  constructor(
    private readonly fetchUnitTypesQueryHandler: FetchUnitTypesQueryHandler,
    private readonly findByIdUnitTypeQueryHandler: FindByIdUnitTypeQueryHandler,
    private readonly createUnitTypeCommandHandler: CreateUnitTypeCommandHandler,
    private readonly updateUnitTypeCommandHandler: UpdateUnitTypeCommandHandler,
    private readonly deleteUnitTypeCommandHandler: DeleteUnitTypeCommandHandler
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new unit type' })
  @ApiResponse({ status: 201, description: 'Unit type created', type: UnitTypeResponse })
  async create(@Body() request: CreateUnitTypeRequest): Promise<UnitTypeResponse> {
    const command = new CreateUnitTypeCommand(request.name);

    return await this.createUnitTypeCommandHandler.handle(command);
  }

  @Get()
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
  @ApiResponse({ status: 200, description: 'List of unit types', type: [UnitTypeResponse] })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ data: UnitTypeResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchUnitTypeQuery(query, page, limit);
    const cities = await this.fetchUnitTypesQueryHandler.handle(fetchQuery);

    return {
      data: cities.data,
      pagination: cities.pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a unit type by ID' })
  @ApiResponse({ status: 200, description: 'Unit type found', type: UnitTypeResponse })
  @ApiResponse({ status: 404, description: 'Unit type not found' })
  async findById(@Param('id') id: string): Promise<UnitTypeResponse> {
    const command = new FindByIdUnitTypeQuery(id);

    return await this.findByIdUnitTypeQueryHandler.handle(command);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a unit type by ID' })
  @ApiResponse({ status: 200, description: 'Unit type updated', type: UnitTypeResponse })
  @ApiResponse({ status: 404, description: 'Unit type not found' })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateUnitTypeRequest
  ): Promise<UnitTypeResponse> {
    const command = new UpdateUnitTypeCommand(id, request.name);

    return await this.updateUnitTypeCommandHandler.handle(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a unit type by ID' })
  @ApiResponse({ status: 204, description: 'Unit type deleted' })
  @ApiResponse({ status: 404, description: 'Unit type not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteUnitTypeCommandHandler.handle(id);
  }
}
