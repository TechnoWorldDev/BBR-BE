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
import { CreateBrandTypesCommand } from '../application/command/create-brand-type.command';
import { DeleteBrandTypeCommand } from '../application/command/delete-brand-type.command';
import { FetchBrandTypesQuery } from '../application/command/fetch-brand-types.query';
import { FindByIdBrandTypeQuery } from '../application/command/find-by-id-brand-type.query';
import { UpdateBrandTypeCommand } from '../application/command/update-brand-type.command';
import { CreateBrandTypesCommandHandler } from '../application/handlers/create-brand-type.command.handler';
import { DeleteBrandTypeCommandHandler } from '../application/handlers/delete-brand-type.command.handler';
import { UpdateBrandTypeCommandHandler } from '../application/handlers/update-brand-type.command.handler';
import { FetchAllBrandTypesQueryHandler } from '../application/query/fetch-all-brand-types.query.handler';
import { FindByIdBrandTypeQueryHandler } from '../application/query/find-by-id-brand-type.query.handler';
import { BrandTypeMapper } from './mappers/brand-type.mapper';
import { CreateBrandTypeRequest } from './request/create-brand-type.request';
import { UpdateBrandTypeRequest } from './request/update-brand-type.request';
import { BrandTypeResponse } from './response/brand-type.response';
import { OrderByDirection } from 'objection';

@ApiTags('Brand Types')
@Controller('brand-types')
export class BrandTypesController {
  constructor(
    private readonly fetchAllBrandTypesQueryHandler: FetchAllBrandTypesQueryHandler,
    private readonly findByIdBrandTypeQueryHandler: FindByIdBrandTypeQueryHandler,
    private readonly createBrandTypesCommandHandler: CreateBrandTypesCommandHandler,
    private readonly updateBrandTypesCommandHandler: UpdateBrandTypeCommandHandler,
    private readonly deleteBrandTypesCommandHandler: DeleteBrandTypeCommandHandler
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
  ): Promise<{ data: BrandTypeResponse[]; pagination: PaginationResponse }> {
    const { data, pagination } = await this.fetchAllBrandTypesQueryHandler.handle(
      new FetchBrandTypesQuery(query, page, limit, sortBy, sortOrder)
    );

    return {
      data: data.map((brandType) => BrandTypeMapper.toResponse(brandType)),
      pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a brand type by id' })
  async findById(@Param('id') id: string): Promise<BrandTypeResponse> {
    const command = new FindByIdBrandTypeQuery(id);
    const brandType = await this.findByIdBrandTypeQueryHandler.handle(command);

    return BrandTypeMapper.toResponse(brandType);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new brand type' })
  async create(@Body() request: CreateBrandTypeRequest): Promise<BrandTypeResponse> {
    const command = new CreateBrandTypesCommand(request.name, request.description);
    const brandType = await this.createBrandTypesCommandHandler.handle(command);

    return BrandTypeMapper.toResponse(brandType);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update a brand type' })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateBrandTypeRequest
  ): Promise<BrandTypeResponse> {
    const command = new UpdateBrandTypeCommand(id, request.name, request.description);
    const brandType = await this.updateBrandTypesCommandHandler.handle(command);

    return BrandTypeMapper.toResponse(brandType);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Delete a brand type' })
  async delete(@Param('id') id: string) {
    const command = new DeleteBrandTypeCommand(id);

    await this.deleteBrandTypesCommandHandler.handle(command);
  }
}
