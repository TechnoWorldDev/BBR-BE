import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderByDirection } from 'objection';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { FetchContinentsQuery } from '../application/command/fetch-continents.query';
import { FetchContinentsPublicCommandQuery } from '../application/query/fetch-continents.public.command.query';
import { FindContinentByIdCommandQuery } from '../application/query/find-continent-by-id.command.query';
import { ContinentResponse } from './response/continent.response';

@ApiTags('Continents Public')
@Controller('public/continents')
export class ContinentPublicController {
  constructor(
    private readonly findContinentByIdCommandQuery: FindContinentByIdCommandQuery,
    private readonly fetchContinentsPublicCommandQuery: FetchContinentsPublicCommandQuery
  ) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all continents' })
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
  @ApiResponse({ status: 200, description: 'List of continents', type: [ContinentResponse] })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection
  ): Promise<{ data: ContinentResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchContinentsQuery(query, page, limit, sortBy, sortOrder);
    return await this.fetchContinentsPublicCommandQuery.handler(fetchQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ContinentResponse> {
    const continent = await this.findContinentByIdCommandQuery.handle(id);
    return new ContinentResponse(
      continent.id,
      continent.name,
      continent.code,
      continent.createdAt,
      continent.updatedAt
    );
  }
}
