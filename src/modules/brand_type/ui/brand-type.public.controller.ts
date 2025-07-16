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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchBrandTypesQuery } from '../application/command/fetch-brand-types.query';
import { FindByIdBrandTypeQuery } from '../application/command/find-by-id-brand-type.query';
import { FetchAllBrandTypesQueryHandler } from '../application/query/fetch-all-brand-types.query.handler';
import { FindByIdBrandTypeQueryHandler } from '../application/query/find-by-id-brand-type.query.handler';
import { BrandTypeMapper } from './mappers/brand-type.mapper';
import { OrderByDirection } from 'objection';
import { BrandTypePublicResponse } from './response/brand-type.public.response';

@ApiTags('Brand Types')
@Controller('public/brand-types')
export class BrandTypesPublicController {
  constructor(
    private readonly fetchAllBrandTypesQueryHandler: FetchAllBrandTypesQueryHandler,
    private readonly findByIdBrandTypeQueryHandler: FindByIdBrandTypeQueryHandler,
  ) {}

  @Get()
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
  @ApiOperation({ summary: 'Get all brand types' })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection
  ): Promise<{ data: BrandTypePublicResponse[]; pagination: PaginationResponse }> {
    const { data, pagination } = await this.fetchAllBrandTypesQueryHandler.handle(
      new FetchBrandTypesQuery(query, page, limit, sortBy, sortOrder)
    );

    return {
      data: data.map((brandType) => BrandTypeMapper.toPublicResponse(brandType)),
      pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a brand type by id' })
  async findById(@Param('id') id: string): Promise<BrandTypePublicResponse> {
    const command = new FindByIdBrandTypeQuery(id);
    const brandType = await this.findByIdBrandTypeQueryHandler.handle(command);

    return BrandTypeMapper.toPublicResponse(brandType);
  }
}
