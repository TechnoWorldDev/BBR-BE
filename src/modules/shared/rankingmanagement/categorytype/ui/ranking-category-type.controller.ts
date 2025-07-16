import { Controller, Get, Param, Query, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RankingCategoryTypeResponse } from './response/ranking-category-type.response';
import { FetchRankingCategoryTypesCommandQuery } from '../application/query/fetch-ranking-category-types.command.query';
import { RankingCategoryType } from '../domain/ranking-category-type.entity';
import { CreateRankingCategoryTypeCommandHandler } from '../application/handler/create-ranking-category-type.command.handler';
import { CreateRankingCategoryTypeRequest } from './request/create-ranking-category-type.request';
import { FindRankingCategoryTypeByIdCommandQuery } from '../application/query/find-ranking-category-type-by-id.command.query';
import { UpdateRankingCategoryTypeCommandHandler } from '../application/handler/update-ranking-category-type.command.handler';
import { DeleteRankingCategoryTypeCommandHandler } from '../application/handler/delete-ranking-category-type.command.handler';
import { UpdateRankingCategoryTypeRequest } from './request/update-ranking-category-type.request';
import { FetchRankingCategoryTypesQuery } from '../application/command/fetch-ranking-category-type.query';
import { RankingCategoryTypeMapper } from './mapper/category-type.mapper';
import { OrderByDirection } from 'objection';

@ApiTags('Ranking Category Types')
@Controller('ranking-category-types')
export class RankingCategoryTypeController {
  constructor(
    private readonly fetchRankingCategoryTypesCommandQuery: FetchRankingCategoryTypesCommandQuery,
    private readonly findRankingCategoryTypeByIdCommandQuery: FindRankingCategoryTypeByIdCommandQuery,
    private readonly createRankingCategoryTypeCommandHandler: CreateRankingCategoryTypeCommandHandler,
    private readonly updateRankingCategoryTypeCommandHandler: UpdateRankingCategoryTypeCommandHandler,
    private readonly deleteRankingCategoryTypeCommandHandler: DeleteRankingCategoryTypeCommandHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all ranking category types' })
  @ApiResponse({ type: [RankingCategoryTypeResponse] })
  async fetchAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection
  ) {
    const { data, pagination } = await this.fetchRankingCategoryTypesCommandQuery.handler(
      new FetchRankingCategoryTypesQuery(query, page, limit, sortBy, sortOrder)
    );

    const mappedRankingCategoryTypes = data.map((categoryType: RankingCategoryType) =>
      RankingCategoryTypeMapper.toResponse(categoryType)
    );

    return {
      data: mappedRankingCategoryTypes,
      pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ranking category type by ID' })
  @ApiResponse({ type: RankingCategoryTypeResponse })
  async findById(@Param('id') id: string) {
    const rankingCategoryType = await this.findRankingCategoryTypeByIdCommandQuery.handle(id);

    return RankingCategoryTypeMapper.toResponse(rankingCategoryType);
  }

  @Post()
  @ApiOperation({ summary: 'Create a ranking category type' })
  @ApiResponse({ type: RankingCategoryTypeResponse })
  async create(@Body() createRankingCategoryTypeRequest: CreateRankingCategoryTypeRequest) {
    const command = RankingCategoryTypeMapper.toCreateCommand(createRankingCategoryTypeRequest);
    const createdRankingCategoryType =
      await this.createRankingCategoryTypeCommandHandler.handle(command);

    return RankingCategoryTypeMapper.toResponse(createdRankingCategoryType);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a ranking category type' })
  @ApiResponse({ type: RankingCategoryTypeResponse })
  async update(
    @Param('id') id: string,
    @Body() updateRankingCategoryTypeRequest: UpdateRankingCategoryTypeRequest
  ) {
    const command = RankingCategoryTypeMapper.toUpdateCommand(id, updateRankingCategoryTypeRequest);
    const updatedRankingCategoryType =
      await this.updateRankingCategoryTypeCommandHandler.handle(command);

    return RankingCategoryTypeMapper.toResponse(updatedRankingCategoryType);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ranking category type' })
  async delete(@Param('id') id: string) {
    return this.deleteRankingCategoryTypeCommandHandler.handle(id);
  }
}
