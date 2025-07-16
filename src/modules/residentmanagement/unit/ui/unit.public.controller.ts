import { Controller, Get, Param, Query, Post, Body, Put, Delete, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UnitResponse } from './response/unit.response';
import { UnitMapper } from './mapper/unit.mapper';
import { Unit } from '../domain/unit.entity';
import { FindUnitByIdCommandQuery } from '../application/query/find-by-id-unit.query';
import { FetchUnitsCommandQuery } from '../application/query/fetch-units.query';
import { OrderByDirection } from 'objection';
import { FetchUnitsQuery } from '../application/command/fetch-units.query';
import { UnitStatusEnum } from '../domain/unit-status.enum';
import { FindUnitBySlugCommandQuery } from '../application/query/find-by-slug-unit.query';

@ApiTags('Units')
@Controller('public/units')
export class UnitPublicController {
  constructor(
    private readonly fetchUnitsCommandQuery: FetchUnitsCommandQuery,
    private readonly findUnitByIdCommandQuery: FindUnitByIdCommandQuery,
    private readonly findUnitBySlugCommandQuery: FindUnitBySlugCommandQuery
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all units' })
  @ApiResponse({ type: [UnitResponse] })
  async fetchAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('unitTypeId') unitTypeId?: string[],
    @Query('residenceId') residenceId?: string[],
    @Query('regularPrice.gt') regularPriceGt?: number,
    @Query('regularPrice.lt') regularPriceLt?: number
  ) {
    const regularPrice = {
      ...(regularPriceGt !== undefined && { gt: +regularPriceGt }),
      ...(regularPriceLt !== undefined && { lt: +regularPriceLt }),
    };

    const { data, pagination } = await this.fetchUnitsCommandQuery.handle(
      null,
      new FetchUnitsQuery(
        query,
        page,
        limit,
        sortBy,
        sortOrder,
        residenceId,
        unitTypeId,
        [UnitStatusEnum.ACTIVE],
        Object.keys(regularPrice).length > 0 ? regularPrice : undefined
      )
    );

    const mappedUnits = data.map((unit: Unit) => UnitMapper.toPublicResponse(unit));

    return {
      data: mappedUnits,
      pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get unit by ID' })
  @ApiResponse({ type: UnitResponse })
  async findById(@Param('id') id: string) {
    const unit = await this.findUnitByIdCommandQuery.handle(id);

    return UnitMapper.toPublicResponse(unit);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get unit by slug' })
  @ApiResponse({ type: UnitResponse })
  async findBySlug(@Param('slug') slug: string) {
    const unit = await this.findUnitBySlugCommandQuery.handle(slug);

    return UnitMapper.toPublicResponse(unit);
  }
}
