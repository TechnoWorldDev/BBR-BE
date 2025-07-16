import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { CreateLifestyleCommand } from '../application/command/create-lifestyle.command';
import { DeleteLifestyleCommand } from '../application/command/delete-lifestyle.command';
import { FetchLifestyleQuery } from '../application/command/fetch-lifestyle.query';
import { UpdateLifestyleCommand } from '../application/command/update-lifestyle.command';
import { CreateLifestyleCommandHandler } from '../application/handlers/create-lifestyle.command.handler';
import { DeleteLifestyleCommandHandler } from '../application/handlers/delete-lifestyle.command.handler';
import { UpdateLifestyleCommandHandler } from '../application/handlers/update-lifestyle.command.handler';
import { FetchAllLifestylesQueryHandler } from '../application/query/fetch-all-lifestyles.query.handler';
import { FindByIdLifestyleQueryHandler } from '../application/query/find-by-id-lifestyle.query.handler';
import { Lifestyle } from '../domain/lifestyle.entity';
import { LifestyleMapper } from './mappers/lifestyle.mapper';
import { CreateLifestyleRequest } from './request/create-lifestyle.request';
import { UpdateLifestyleRequest } from './request/update-lifestyle.request';
import { LifestyleResponse } from './response/lifestyle.response';
import { OrderByDirection } from 'objection';

@ApiTags('Lifestyles')
@Controller('lifestyles')
export class LifestyleController {
  constructor(
    private readonly createLifestyleCommandHandler: CreateLifestyleCommandHandler,
    private readonly updateLifestyleCommandHandler: UpdateLifestyleCommandHandler,
    private readonly deleteLifestyleCommandHandler: DeleteLifestyleCommandHandler,
    private readonly fetchAllLifestylesQueryHandler: FetchAllLifestylesQueryHandler,
    private readonly findByIdLifestyleQueryHandler: FindByIdLifestyleQueryHandler
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Lifestyles fetched successfully', type: [Lifestyle] })
  @ApiQuery({
    name: 'query',
    required: false,
    type: String,
    description: 'Search query for lifestyle name',
  })
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
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection
  ): Promise<{ data: LifestyleResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchLifestyleQuery(query, page, limit, sortBy, sortOrder);
    const { data, pagination } = await this.fetchAllLifestylesQueryHandler.handle(fetchQuery);

    return {
      data: data.map((lifestyle) => LifestyleMapper.toResponse(lifestyle)),
      pagination,
    };
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 201, description: 'Lifestyle created successfully', type: Lifestyle })
  async create(@Body() request: CreateLifestyleRequest): Promise<Lifestyle> {
    const command = new CreateLifestyleCommand(request.name, request.order);

    const lifestyle = await this.createLifestyleCommandHandler.handle(command);

    return lifestyle;
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Lifestyle fetched successfully', type: Lifestyle })
  async findById(@Param('id') id: string): Promise<LifestyleResponse> {
    const lifestyle = await this.findByIdLifestyleQueryHandler.handle(id);
    return LifestyleMapper.toResponse(lifestyle);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 200, description: 'Lifestyle updated successfully', type: Lifestyle })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateLifestyleRequest
  ): Promise<Lifestyle> {
    const command = new UpdateLifestyleCommand(id, request.name, request.order);

    return await this.updateLifestyleCommandHandler.handle(command);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Lifestyle deleted successfully' })
  async delete(@Param('id') id: string): Promise<void> {
    const command = new DeleteLifestyleCommand(id);

    await this.deleteLifestyleCommandHandler.handle(command);
  }
}
