import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { CreateBrandCommand } from '../application/command/create-brand.command';
import { FetchBrandsQuery } from '../application/command/fetch-brands.query';
import { UpdateBrandStatusCommand } from '../application/command/update-brand-status.command';
import { UpdateBrandCommand } from '../application/command/update-brand.command';
import { CreateBrandCommandHandler } from '../application/handlers/create-brand.command.handler';
import { DeleteBrandCommandHandler } from '../application/handlers/delete-brand.command.handler';
import { UpdateBrandStatusCommandHandler } from '../application/handlers/update-brand-status.command.handler';
import { UpdateBrandCommandHandler } from '../application/handlers/update-brand.command.handler';
import { Brand } from '../domain/brand.entity';
import { BrandMapper } from './mappers/brand.mapper';
import { CreateBrandRequest } from './request/create-brand.request';
import { UpdateBrandStatusRequest } from './request/update-brand-status.request';
import { UpdateBrandRequest } from './request/update-brand.request';
import { BrandResponse } from './response/brand-response';
import { FindByIdBrandQueryHandler } from '../application/query/find-by-id-brand.query.handler';
import { FetchAllBrandQueryHandler } from '../application/query/fetch-all-brands.query.handler';
import { OrderByDirection } from 'objection';
import { BrandStatus } from '../domain/brand-status.enum';

@ApiTags('brands')
@ApiBearerAuth()
@Controller('brands')
export class BrandController {
  constructor(
    private readonly createBrandHandler: CreateBrandCommandHandler,
    private readonly findByIdBrandHandler: FindByIdBrandQueryHandler,
    private readonly fetchAllBrandHandler: FetchAllBrandQueryHandler,
    private readonly updateBrandHandler: UpdateBrandCommandHandler,
    private readonly deleteBrandHandler: DeleteBrandCommandHandler,
    private readonly updateBrandStatusCommandHandler: UpdateBrandStatusCommandHandler
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'Brand created successfully', type: Brand })
  @ApiResponse({ status: 400, description: 'Bad request (validation error)' })
  @ApiResponse({ status: 409, description: 'Conflict - Brand name already exists.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error - Brand could not be saved.' })
  async create(@Body() request: CreateBrandRequest): Promise<Brand> {
    const command = new CreateBrandCommand(
      request.name,
      request.slug,
      request.description,
      request.brandTypeId,
      request.logoId,
      request.status
    );
    const brand = await this.createBrandHandler.handle(command);

    return brand;
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all brands' })
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
  @ApiResponse({ status: 200, description: 'List of brands', type: [BrandResponse] })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('status') status?: BrandStatus[],
    @Query('brandTypeId') brandTypeId?: string[]
  ): Promise<{ data: BrandResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchBrandsQuery(
      query,
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      brandTypeId
    );
    const { data, pagination } = await this.fetchAllBrandHandler.handle(fetchQuery);

    return {
      data: data.map((brand) => BrandMapper.toResponse(brand)),
      pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand found', type: BrandResponse })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async findOne(@Param('id') id: string): Promise<BrandResponse> {
    const brand = await this.findByIdBrandHandler.handle(id);
    return BrandMapper.toResponse(brand);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update a brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand updated successfully', type: BrandResponse })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error - Brand could not be updated.' })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateBrandRequest
  ): Promise<BrandResponse> {
    const command = new UpdateBrandCommand(
      id,
      request.name,
      request.slug,
      request.description,
      request.brandTypeId,
      request.logoId,
      request.status
    );

    const brand = await this.updateBrandHandler.handle(command);

    return BrandMapper.toResponse(brand);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a brand by ID' })
  @ApiResponse({ status: 204, description: 'Brand deleted successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error - Brand could not be deleted.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteBrandHandler.handle(id);
  }

  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update brand status' })
  @Patch('/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() request: UpdateBrandStatusRequest
  ): Promise<void> {
    const command = new UpdateBrandStatusCommand(id, request.status);
    return this.updateBrandStatusCommandHandler.handle(command);
  }
}
