import { Controller, Get, Param, Query, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AmenityResponse } from './response/amenity.response';
import { FetchAmenitiesCommandQuery } from '../application/query/fetch-amenities.command.query';
import { Amenity } from '../domain/amenity.entity';
import { CreateAmenityCommandHandler } from '../application/handler/create-amenity.command.handler';
import { CreateAmenityRequest } from './request/create-amenity.request';
import { FindAmenityByIdCommandQuery } from '../application/query/find-amenity-by-id.command.query';
import { UpdateAmenityCommandHandler } from '../application/handler/update-amenity.command.handler';
import { DeleteAmenityCommandHandler } from '../application/handler/delete-amenity.command.handler';
import { FetchAmenitiesQuery } from '../application/commands/fetch-amenities.query';
import { UpdateAmenityRequest } from './request/update-amenity.request';
import { AmenityMapper } from './mapper/amenity.ui.mapper';
import { OrderByDirection } from 'objection';

@ApiTags('Amenities')
@Controller('amenities')
export class AmenityController {
  constructor(
    private readonly fetchAmenitiesCommandQuery: FetchAmenitiesCommandQuery,
    private readonly findAmenityByIdCommandQuery: FindAmenityByIdCommandQuery,
    private readonly createAmenityCommandHandler: CreateAmenityCommandHandler,
    private readonly updateAmenityCommandHandler: UpdateAmenityCommandHandler,
    private readonly deleteAmenityCommandHandler: DeleteAmenityCommandHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all amenities' })
  @ApiResponse({ type: [AmenityResponse] })
  async fetchAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection
  ) {
    const { data, pagination } = await this.fetchAmenitiesCommandQuery.handler(
      new FetchAmenitiesQuery(query, page, limit, sortBy, sortOrder)
    );

    const mappedAmenities = data.map((amenity: Amenity) => AmenityMapper.toResponse(amenity));

    return {
      data: mappedAmenities,
      pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get amenity by ID' })
  @ApiResponse({ type: AmenityResponse })
  async findById(@Param('id') id: string) {
    const amenity = await this.findAmenityByIdCommandQuery.handle(id);

    return AmenityMapper.toResponse(amenity);
  }

  @Post()
  @ApiOperation({ summary: 'Create an amenity' })
  @ApiResponse({ type: AmenityResponse })
  async create(@Body() createAmenityRequest: CreateAmenityRequest) {
    const command = AmenityMapper.toCreateCommand(createAmenityRequest);
    const createdAmenity = await this.createAmenityCommandHandler.handle(command);

    return AmenityMapper.toResponse(createdAmenity);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an amenity' })
  @ApiResponse({ type: AmenityResponse })
  async update(@Param('id') id: string, @Body() updateAmenityRequest: UpdateAmenityRequest) {
    const command = AmenityMapper.toUpdateCommand(id, updateAmenityRequest);
    const updatedAmenity = await this.updateAmenityCommandHandler.handle(command);

    return AmenityMapper.toResponse(updatedAmenity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an amenity' })
  async delete(@Param('id') id: string) {
    return this.deleteAmenityCommandHandler.handle(id);
  }
}
