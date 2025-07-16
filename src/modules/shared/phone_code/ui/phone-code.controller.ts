import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PhoneCodeResponse } from './response/phone-code.response';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { OrderByDirection } from 'objection';

import { FetchPhoneCodesCommandQuery } from '../application/query/fetch-phone-codes-command.query';
import { FindPhoneCodeByIdCommandQuery } from '../application/query/find-phone-code-by-id-command.query';
import { FetchPhoneCodesQuery } from '../application/command/fetch-phone-codes.query';
import { PhoneCodeMapper } from './mapper/phone-code.mapper';

@ApiTags('Phone Codes')
@Controller('phone-codes')
export class PhoneCodeController {
  constructor(
    private readonly fetchPhoneCodesCommandQuery: FetchPhoneCodesCommandQuery,
    private readonly findPhoneCodeByIdCommandQuery: FindPhoneCodeByIdCommandQuery
  ) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all phone codes' })
  @ApiQuery({ name: 'query', required: false, type: String, description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'List of phone codes', type: [PhoneCodeResponse] })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection
  ): Promise<{ data: PhoneCodeResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchPhoneCodesQuery(query, page, limit, sortBy, sortOrder);
    const result = await this.fetchPhoneCodesCommandQuery.handler(fetchQuery);

    return {
      data: result.data.map((code) => PhoneCodeMapper.mapToResponse(code)),
      pagination: result.pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a phone code by ID' })
  @ApiResponse({ status: 200, description: 'Phone code details', type: PhoneCodeResponse })
  async findOne(@Param('id') id: string): Promise<PhoneCodeResponse> {
    const phoneCode = await this.findPhoneCodeByIdCommandQuery.handle(id);
    return PhoneCodeMapper.mapToResponse(phoneCode);
  }
}
