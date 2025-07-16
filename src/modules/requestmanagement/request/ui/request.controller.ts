import { Controller, Get, Param, Query, Post, Body, Put, Delete, Patch, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestResponse } from './response/request-response.dto';
import { DeleteRequestCommandHandler } from '../application/handler/delete-request.command.handler';
import { RequestMapper } from './mapper/request.mapper';
import { Request } from '../domain/request.entity';
import { CreateRequestRequest } from './request/create-request.request';
import { OrderByDirection } from 'objection';
import { FetchRequestsQuery } from '../application/command/fetch-requests.query';
import { UpdateRequestStatusRequest } from './request/update-request-status.request';
import { CreateRequestCommandHandler } from '../application/handler/create-request-command.handler';
import { FindRequestByIdCommandQuery } from '../application/query/find-request-by-id.command.query';
import { FetchRequestsCommandQuery } from '../application/query/fetch-requests.command.query';
import { UpdateRequestStatusCommandHandler } from '../application/handler/update-request-status.command.handler';
import { UpdateRequestRequest } from './request/update-request.request';
import { UpdateRequestCommandHandler } from '../application/handler/update-request.command.handler';
import { User } from 'src/modules/user/domain/user.entity';

@ApiTags('Requests')
@Controller('requests')
export class RequestController {
  constructor(
    private readonly fetchRequestsCommandQuery: FetchRequestsCommandQuery,
    private readonly findRequestByIdCommandQuery: FindRequestByIdCommandQuery,
    private readonly createRequestCommandHandler: CreateRequestCommandHandler,
    private readonly updateRequestStatusCommandHandler: UpdateRequestStatusCommandHandler,
    private readonly updateRequestCommandHandler: UpdateRequestCommandHandler,
    private readonly deleteRequestCommandHandler: DeleteRequestCommandHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all requests' })
  @ApiResponse({ type: [RequestResponse] })
  async fetchAll(
    @Req() req,
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: OrderByDirection = 'desc',
    @Query('leadId') leadId?: string[],
    @Query('type') type?: string[],
    @Query('status') status?: string[],
    @Query('companyId') companyId?: string
  ) {
    const user = req.user as User;
    const { data, pagination } = await this.fetchRequestsCommandQuery.handle(
      user,
      new FetchRequestsQuery(query, page, limit, sortBy, sortOrder, leadId, type, status, companyId)
    );

    const mappedRequests = data.map((request: Request) => RequestMapper.toResponse(request));

    return {
      data: mappedRequests,
      pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get request by ID' })
  @ApiResponse({ type: RequestResponse })
  async findById(@Req() req, @Param('id') id: string) {
    const user = req.user as User;
    const request = await this.findRequestByIdCommandQuery.handle(user, id);

    return RequestMapper.toResponse(request);
  }

  @Post()
  @ApiOperation({ summary: 'Create a request' })
  @ApiResponse({ type: RequestResponse })
  async create(@Body() request: CreateRequestRequest) {
    const command = RequestMapper.toCreateCommand(request);
    const createdRequest = await this.createRequestCommandHandler.handle(command);

    return RequestMapper.toResponse(createdRequest);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update a request status' })
  @ApiResponse({ type: RequestResponse })
  async updateStatus(@Param('id') id: string, @Body() request: UpdateRequestStatusRequest) {
    const command = RequestMapper.toUpdateStatusCommand(id, request);
    const updatedRequest = await this.updateRequestStatusCommandHandler.handle(command);

    return RequestMapper.toResponse(updatedRequest);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a request' })
  @ApiResponse({ type: RequestResponse })
  async update(@Param('id') id: string, @Body() request: UpdateRequestRequest) {
    const command = RequestMapper.toUpdateCommand(id, request);
    const updatedRequest = await this.updateRequestCommandHandler.handle(command);

    return RequestMapper.toResponse(updatedRequest);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a request' })
  async delete(@Param('id') id: string) {
    return this.deleteRequestCommandHandler.handle(id);
  }
}
