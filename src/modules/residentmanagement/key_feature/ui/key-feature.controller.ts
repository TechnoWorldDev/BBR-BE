import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { KeyFeatureResponse } from './response/key-feature.response';
import { FetchKeyFeaturesQuery } from '../application/commands/fetch-key-features.query';
import { FindAllKeyFeaturesQueryHandler } from '../application/query/find-all-key-features.query.handler';
import { KeyFeatureMapper } from './mappers/key-feature.mapper';
import { FindByIdKeyFeatureQueryHandler } from '../application/query/find-by-id-key-feature.query.handler';
import { CreateKeyFeatureCommandHandler } from '../application/handlers/create-key-feature.command.handler';
import { UpdateKeyFeatureCommandHandler } from '../application/handlers/update-key-feature.command.handler';
import { DeleteKeyFeatureCommandHandler } from '../application/handlers/delete-key-feature.command.handler';
import { CreateKeyFeatureRequest } from './request/create-key-feature.request';
import { CreateKeyFeatureCommand } from '../application/commands/create-key-feature.command';
import { UpdateKeyFeatureCommand } from '../application/commands/update-key-feature.command';

@ApiTags('Key Feature')
@Controller('key-features')
export class KeyFeatureController {
  constructor(
    private readonly findAllKeyFeatureHandler: FindAllKeyFeaturesQueryHandler,
    private readonly findByIdKeyFeatureHandler: FindByIdKeyFeatureQueryHandler,
    private readonly createKeyFeatureHandler: CreateKeyFeatureCommandHandler,
    private readonly updateKeyFeatureHandler: UpdateKeyFeatureCommandHandler,
    private readonly deleteKeyFeatureHandler: DeleteKeyFeatureCommandHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all key features' })
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
  @ApiResponse({ status: 200, description: 'List of key features', type: [KeyFeatureResponse] })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const fetchQuery = new FetchKeyFeaturesQuery(query, page, limit);

    const { data, pagination } = await this.findAllKeyFeatureHandler.handle(fetchQuery);

    return {
      data: data.map((keyFeature) => KeyFeatureMapper.toResponse(keyFeature)),
      pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get key feature by id' })
  @ApiResponse({ status: 200, description: 'Key feature', type: KeyFeatureResponse })
  async findById(@Param('id') id: string) {
    return await this.findByIdKeyFeatureHandler.handle(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create key feature' })
  @ApiResponse({ status: 200, description: 'Key feature', type: KeyFeatureResponse })
  async create(@Body() request: CreateKeyFeatureRequest) {
    const command = new CreateKeyFeatureCommand(request.name);

    return await this.createKeyFeatureHandler.handle(command);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update key feature' })
  @ApiResponse({ status: 200, description: 'Key feature', type: KeyFeatureResponse })
  async update(@Param('id') id: string, @Body() request: CreateKeyFeatureRequest) {
    const command = new UpdateKeyFeatureCommand(id, request.name);

    return await this.updateKeyFeatureHandler.handle(command);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete key feature' })
  async delete(@Param('id') id: string) {
    return await this.deleteKeyFeatureHandler.handle(id);
  }
}
