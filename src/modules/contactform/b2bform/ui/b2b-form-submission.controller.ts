import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { B2BFormSubmissionResponse } from './response/b2b-form-submission.response';
import { CreateB2BFormSubmissionRequest } from './request/create-b2b-form-submission.request';
import { UpdateB2BFormSubmissionRequest } from './request/update-b2b-form-submission.request';
import { UpdateB2BFormSubmissionStatusRequest } from './request/update-b2b-form-submission-status.request';

import { B2BFormSubmissionMapper } from './mapper/b2b-form-submission.mapper';



import { FetchB2BFormSubmissionsQuery } from '../application/command/fetch-b2b-form-submissions.query';
import { FetchB2BFormSubmissionsCommandQuery } from '../application/query/fetch-b2b-form-submissions.query.handler';
import {
  FindB2BFormSubmissionByIdCommandQuery
} from '../application/query/find-b2b-form-submission-by-id.query.handler';
import {
  CreateB2BFormSubmissionCommandHandler
} from '../application/handler/create-b2b-form-submission-command.handler';
import {
  UpdateB2BFormSubmissionCommandHandler
} from '../application/handler/update-b2b-form-submission-command.handler';
import {
  UpdateB2BFormSubmissionStatusCommandHandler
} from '../application/handler/update-b2b-form-submission-status-command.handler';
import {
  DeleteB2BFormSubmissionCommandHandler
} from '../application/handler/delete-b2b-form-submission-command.handler';

@ApiTags('B2B Form Submissions')
@Controller()
export class B2BFormSubmissionController {
  constructor(
    private readonly fetchB2BFormSubmissionsCommandQuery: FetchB2BFormSubmissionsCommandQuery,
    private readonly findB2BFormSubmissionByIdCommandQuery: FindB2BFormSubmissionByIdCommandQuery,
    private readonly createB2BFormSubmissionCommandHandler: CreateB2BFormSubmissionCommandHandler,
    private readonly updateB2BFormSubmissionCommandHandler: UpdateB2BFormSubmissionCommandHandler,
    private readonly updateB2BFormSubmissionStatusCommandHandler: UpdateB2BFormSubmissionStatusCommandHandler,
    private readonly deleteB2BFormSubmissionCommandHandler: DeleteB2BFormSubmissionCommandHandler,
  ) {}

  @Get('b2b-form-submissions')
  @ApiOperation({ summary: 'Get all B2B form submissions' })
  @ApiResponse({ type: [B2BFormSubmissionResponse] })
  async fetchAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('status') status?: string,
  ) {
    const { data, pagination } = await this.fetchB2BFormSubmissionsCommandQuery.handle(
      new FetchB2BFormSubmissionsQuery(query, page, limit, sortBy, sortOrder,status)
    );

    const responses = data.map((b2b) => B2BFormSubmissionMapper.toResponse(b2b));

    return {
      data: responses,
      pagination,
    };
  }

  @Get('b2b-form-submissions/:id')
  @ApiOperation({ summary: 'Get B2B form submission by ID' })
  @ApiResponse({ type: B2BFormSubmissionResponse })
  async findById(@Param('id') id: string) {
    const b2bFormSubmission = await this.findB2BFormSubmissionByIdCommandQuery.handle(id);
    return B2BFormSubmissionMapper.toResponse(b2bFormSubmission);
  }

  @Post('public/b2b-form-submissions')
  @ApiOperation({ summary: 'Create a new B2B form submission' })
  @ApiResponse({ type: B2BFormSubmissionResponse })
  async create(@Body() request: CreateB2BFormSubmissionRequest) {
    const command = B2BFormSubmissionMapper.toCreateCommand(request);
    const b2bFormSubmission = await this.createB2BFormSubmissionCommandHandler.handle(command);
    return B2BFormSubmissionMapper.toResponse(b2bFormSubmission);
  }

  @Put('b2b-form-submissions/:id')
  @ApiOperation({ summary: 'Update a B2B form submission' })
  @ApiResponse({ type: B2BFormSubmissionResponse })
  async update(@Param('id') id: string, @Body() request: UpdateB2BFormSubmissionRequest) {
    const command = B2BFormSubmissionMapper.toUpdateCommand(id, request);
    const b2bFormSubmission = await this.updateB2BFormSubmissionCommandHandler.handle(command);
    return B2BFormSubmissionMapper.toResponse(b2bFormSubmission);
  }

  @Patch('b2b-form-submissions/:id/status')
  @ApiOperation({ summary: 'Update status of a B2B form submission' })
  @ApiResponse({ type: B2BFormSubmissionResponse })
  async updateStatus(@Param('id') id: string, @Body() request: UpdateB2BFormSubmissionStatusRequest) {
    const command = B2BFormSubmissionMapper.toUpdateStatusCommand(id, request);
    const b2bFormSubmission = await this.updateB2BFormSubmissionStatusCommandHandler.handle(command);
    return B2BFormSubmissionMapper.toResponse(b2bFormSubmission);
  }

  @Delete('b2b-form-submissions/:id')
  @ApiOperation({ summary: 'Delete a B2B form submission' })
  async delete(@Param('id') id: string) {
    return this.deleteB2BFormSubmissionCommandHandler.handle(id);
  }
}
