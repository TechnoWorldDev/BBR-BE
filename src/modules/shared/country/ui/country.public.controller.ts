import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderByDirection } from 'objection';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { FetchCountriesQuery } from '../application/commands/fetch-countries.query';
import { FetchCountriesPublicCommandQuery } from '../application/query/fetch-countries.public.command.query';
import { FindCountryByIdCommandQuery } from '../application/query/find-country-by-id.command.query';
import { CountryMapper } from './mapper/coutry.mapper';
import { CountryResponse } from './response/country.response';

@ApiTags('Countries')
@Controller('public/countries')
export class CountryPublicController {
  constructor(
    private readonly findCountryByIdCommandQuery: FindCountryByIdCommandQuery,
    private readonly fetchCountriesPublicCommandQuery: FetchCountriesPublicCommandQuery
  ) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all countries' })
  @ApiResponse({ status: 200, description: 'List of countries', type: [CountryResponse] })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection
  ): Promise<{ data: CountryResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchCountriesQuery(query, page, limit, sortBy, sortOrder);
    const result = await this.fetchCountriesPublicCommandQuery.handler(fetchQuery);

    return {
      data: result.data.map((country) => CountryMapper.mapToResponse(country)),
      pagination: result.pagination,
    };
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CountryResponse> {
    const country = await this.findCountryByIdCommandQuery.handle(id);
    return CountryMapper.mapToResponse(country);
  }
}
