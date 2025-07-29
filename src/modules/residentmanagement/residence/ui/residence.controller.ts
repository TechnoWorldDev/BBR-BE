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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderByDirection } from 'objection';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { CreateResidenceCommand } from '../application/commands/create-residence.command';
import { FetchResidencesQuery } from '../application/commands/fetch-residences.query';
import { UpdateResidenceStatusCommand } from '../application/commands/update-residence-status.command';
import { UpdateResidenceCommand } from '../application/commands/update-residence.command';
import { CreateResidenceCommandHandler } from '../application/handlers/create-residence.command.handler';
import { DeleteResidenceCommandHandler } from '../application/handlers/delete-residence.command.handler';
import { UpdateResidenceCommandHandler } from '../application/handlers/update-residence.command.handler';
import { UpdateResidenceStatusCommandHandler } from '../application/handlers/update-status-residence.command.handler';
import { FindAllResidencesCommandQuery } from '../application/query/find-all-residences.query';
import { FindByIdResidenceCommandQuery } from '../application/query/find-by-id-residence.query';
import { ResidenceStatusEnum } from '../domain/residence-status.enum';
import { ResidenceMapper } from './mappers/residence.mapper';
import { CreateResidenceRequest } from './request/create-residence.request';
import { UpdateResidenceRequest } from './request/update-residence.request';
import { ResidenceResponse } from './response/residence.response';
import { DevelopmentStatusEnum } from 'src/shared/types/development-status.enum';
import { Request } from 'express';
import { User } from '../../../user/domain/user.entity';
import { FetchResidencesUnassignedToCategoryQuery } from '../application/commands/fetch-residences-unassigned-to-category.query';
import { FindAllUnassignedResidencesCommandQuery } from '../application/query/find-all-unassigned-residences.query';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { RBACGuard } from 'src/shared/guards/rbac.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { FetchResidencesByUserCommandQuery } from '../application/query/fetch-residences-by-user.command.query';
import { UpdateStatusResidenceRequest } from './request/update-status.residence.request';

ApiTags('Residence');
@Controller('residences')
@ApiBearerAuth()
export class ResidenceController {
  constructor(
    private readonly createResidenceCommandHandler: CreateResidenceCommandHandler,
    private readonly updateResidenceCommandHandler: UpdateResidenceCommandHandler,
    private readonly updateResidenceStatusCommandHandler: UpdateResidenceStatusCommandHandler,
    private readonly deleteResidenceCommandHandler: DeleteResidenceCommandHandler,
    private readonly findAllResidencesCommandQuery: FindAllResidencesCommandQuery,
    private readonly findByIdResidenceCommandQuery: FindByIdResidenceCommandQuery,
    private readonly findAllUnassignedToCategoryCommandQuery: FindAllUnassignedResidencesCommandQuery,
    private readonly fetchResidencesByUserCommandQuery: FetchResidencesByUserCommandQuery
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all residences' })
  @ApiResponse({
    status: 200,
    description: 'List of residences',
    type: ResidenceResponse,
    isArray: true,
  })
  async findAll(
    @Req() req,
    @Query('query') query?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('status') status?: ResidenceStatusEnum[],
    @Query('developmentStatus') developmentStatus?: DevelopmentStatusEnum[],
    @Query('cityId') cityId?: string[],
    @Query('countryId') countryId?: string[],
    @Query('continentId') continentId?: string[],
    @Query('brandId') brandId?: string[],
    @Query('address') address?: string[]
  ): Promise<{ data: ResidenceResponse[]; pagination: PaginationResponse }> {
    const user = req.user as User;
    let loggedDeveloperCompanyId: string[] | undefined = undefined;

    if (user && user.role?.name?.toLowerCase() === 'developer') {
      loggedDeveloperCompanyId = [user.company!.id];
    }

    const fetchQuery = new FetchResidencesQuery(
      query,
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      developmentStatus,
      cityId,
      countryId,
      brandId,
      address,
      continentId,
      loggedDeveloperCompanyId
    );

    const { data, pagination } = await this.findAllResidencesCommandQuery.handle(fetchQuery);

    return {
      data: data.map((residence) => ResidenceMapper.toResponse(residence)),
      pagination,
    };
  }

  @Get('me')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.RESIDENCES_READ_OWN)
  @ApiOperation({ summary: 'Get all residences' })
  @ApiResponse({
    status: 200,
    description: 'List of residences',
    type: ResidenceResponse,
    isArray: true,
  })
  async findAllByUser(
    @Req() req,
    @Query('query') query?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('status') status?: ResidenceStatusEnum[]
  ): Promise<{ data: ResidenceResponse[]; pagination: PaginationResponse }> {
    const user = req.user as User;

    const { data, pagination } = await this.fetchResidencesByUserCommandQuery.handle(
      user,
      new FetchResidencesQuery(query, page, limit, sortBy, sortOrder, status)
    );

    return {
      data: data.map((residence) => ResidenceMapper.toResponse(residence)),
      pagination,
    };
  }

  @Get('unassigned')
  @ApiOperation({ summary: 'Get all residences' })
  @ApiResponse({
    status: 200,
    description: 'List of residences',
    type: ResidenceResponse,
    isArray: true,
  })
  async findAllUnassignedToCategory(
    @Query('rankingCategoryId') rankingCategoryId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('query') query?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('cityId') cityId?: string[],
    @Query('countryId') countryId?: string[],
    @Query('brandId') brandId?: string[],
    @Query('continentId') continentId?: string[]
  ): Promise<{ data: ResidenceResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchResidencesUnassignedToCategoryQuery(
      query,
      page,
      limit,
      sortBy,
      sortOrder,
      cityId,
      countryId,
      brandId,
      continentId
    );

    const { data, pagination } = await this.findAllUnassignedToCategoryCommandQuery.handle(
      rankingCategoryId,
      fetchQuery
    );

    return {
      data: data.map((residence) => ResidenceMapper.toResponse(residence)),
      pagination,
    };
  }

  @Post()
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_CREATE, PermissionsEnum.RESIDENCES_CREATE_OWN)
  @ApiOperation({ summary: 'Create a new residence' })
  @ApiResponse({ status: 201, description: 'Residence created', type: ResidenceResponse })
  async create(
    @Body() request: CreateResidenceRequest,
    @Req() req: Request
  ): Promise<ResidenceResponse> {
    const user = req.user as User;

    const command = new CreateResidenceCommand(
      request.name,
      request.slug,
      request.websiteUrl,
      request.subtitle,
      request.description,
      request.budgetStartRange,
      request.budgetEndRange,
      request.address,
      request.latitude,
      request.longitude,
      request.brandId,
      request.countryId,
      request.cityId,
      request.rentalPotential,
      request.developmentStatus,
      request.yearBuilt,
      request.floorSqft,
      request.staffRatio,
      request.avgPricePerUnit,
      request.avgPricePerSqft,
      request.petFriendly,
      request.disabledFriendly,
      request.videoTourUrl,
      request.videoTourId,
      request.featuredImageId,
      request.keyFeatures,
      request.amenities,
      request.companyId,
      request.mainGallery,
      request.secondaryGallery,
      request.highlightedAmenities
    );

    const created = await this.createResidenceCommandHandler.handle(user, command);

    return ResidenceMapper.toResponse(created);
  }

  @Patch(':id/status')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update a residence status' })
  @ApiResponse({ status: 200, description: 'Residence status updated', type: ResidenceResponse })
  async updateStatus(
    @Param('id') id: string,
    @Body() request: UpdateStatusResidenceRequest
  ): Promise<void> {
    const command = new UpdateResidenceStatusCommand(id, request.status);
    await this.updateResidenceStatusCommandHandler.handle(command);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a residence' })
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN, PermissionsEnum.RESIDENCES_UPDATE_OWN)
  @ApiResponse({ status: 200, description: 'Residence updated', type: ResidenceResponse })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateResidenceRequest,
    @Req() req
  ): Promise<ResidenceResponse> {
    const user = req.user as User;

    const command = new UpdateResidenceCommand(
      user,
      id,
      request.name,
      request.slug,
      request.websiteUrl,
      request.subtitle,
      request.description,
      request.budgetStartRange,
      request.budgetEndRange,
      request.address,
      request.latitude,
      request.longitude,
      request.brandId,
      request.countryId,
      request.cityId,
      request.rentalPotential,
      request.developmentStatus,
      request.yearBuilt,
      request.floorSqft,
      request.staffRatio,
      request.avgPricePerUnit,
      request.avgPricePerSqft,
      request.petFriendly,
      request.disabledFriendly,
      request.videoTourUrl,
      request.videoTourId,
      request.featuredImageId,
      request.keyFeatures,
      request.amenities,
      request.companyId,
      request.mainGallery,
      request.secondaryGallery,
      request.highlightedAmenities
    );

    const created = await this.updateResidenceCommandHandler.handle(command);
    return ResidenceMapper.toResponse(created);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a residence by id' })
  @ApiResponse({ status: 200, description: 'Residence found', type: ResidenceResponse })
  async findById(@Param('id') id: string): Promise<ResidenceResponse> {
    const residence = await this.findByIdResidenceCommandQuery.handle(id);
    return ResidenceMapper.toResponse(residence);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a residence' })
  @ApiResponse({ status: 200, description: 'Residence deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteResidenceCommandHandler.handle(id);
  }
}
