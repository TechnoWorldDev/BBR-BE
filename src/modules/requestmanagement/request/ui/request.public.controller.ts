import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestMapper } from './mapper/request.mapper';
import { CreateRequestRequest } from './request/create-request.request';
import { RequestResponse } from './response/request-response.dto';
import { CreateRequestCommandHandler } from '../application/handler/create-request-command.handler';

@ApiTags('Public Requests')
@Controller('public/requests')
export class RequestPublicController {
  constructor(private readonly createRequestCommandHandler: CreateRequestCommandHandler) {}

  @Post()
  @ApiOperation({ summary: 'Create a request' })
  @ApiResponse({ type: RequestResponse })
  async createPublic(@Body() request: CreateRequestRequest) {
    const command = RequestMapper.toCreateCommand(request);
    const createdRequest = await this.createRequestCommandHandler.handle(command);

    return RequestMapper.toResponse(createdRequest);
  }
}
