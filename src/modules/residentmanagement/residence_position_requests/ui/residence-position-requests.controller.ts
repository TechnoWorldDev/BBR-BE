import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { RBACGuard } from 'src/shared/guards/rbac.guard';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { CreatePositionRequestCommandHandler } from '../application/handler/create-position-request.command.handler';
import { CreatePositionRequestRequest } from './request/create-position-request.request';
import { PositionRequestMapper } from './mapper/position-request.mapper';
import { User } from 'src/modules/user/domain/user.entity';
import { OrderByDirection } from 'objection';
import { FetchPositionRequestsQuery } from '../application/command/fetch-position-requests.query';
import { ResidencePositionRequestStatusEnum } from 'src/shared/types/residence-position-requests.enum';
import { fetchPositionRequestsCommandQuery } from '../application/query/fetch-position-requests.command.query';
import { ResidencePositionRequest } from '../domain/residence-position-requests.entity';
import { UpdatePositionRequestStatusRequest } from './request/update-position-request-status.request';
import { UpdatePositionRequestStatusCommand } from '../application/command/update-position-request.command';
import { UpdatePositionRequestStatusCommandHandler } from '../application/handler/update-position-request-status.command.handler';
import { DeletePositionRequestCommandHandler } from '../application/handler/delete-position-request.command.handler';

@ApiTags('Residence Position Requests')
@Controller('position-requests')
export class ResidencePositionRequestsController {
  constructor(
    private readonly createPositionRequestCommandHandler: CreatePositionRequestCommandHandler,
    private readonly updatePositionRequestStatusCommandHandler: UpdatePositionRequestStatusCommandHandler,
    private readonly deletePositionRequestCommandHandler: DeletePositionRequestCommandHandler,
    private readonly fetchPositionRequestsCommandQuery: fetchPositionRequestsCommandQuery
  ) {}

  @Get()
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_READ, PermissionsEnum.POSITION_REQUESTS_READ_OWN)
  @ApiOperation({ summary: 'Get all position requests' })
  async fetchAll(
    @Req() req,
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: OrderByDirection = 'desc',
    @Query('status') status?: ResidencePositionRequestStatusEnum[]
  ) {
    const user = req.user as User;

    const { data, pagination } = await this.fetchPositionRequestsCommandQuery.handle(
      user,
      new FetchPositionRequestsQuery(query, page, limit, sortBy, sortOrder, status)
    );

    const mappedPositionRequests = data.map((positionRequest: ResidencePositionRequest) =>
      PositionRequestMapper.toResponse(positionRequest)
    );

    return {
      data: mappedPositionRequests,
      pagination,
    };
  }

  @Post()
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_SUPERADMIN_CREATE,
    PermissionsEnum.POSITION_REQUESTS_CREATE_OWN
  )
  @ApiOperation({ summary: 'Create position request' })
  async create(@Req() req, @Body() request: CreatePositionRequestRequest) {
    const user = req.user as User;
    const command = PositionRequestMapper.toCreateCommand({
      residenceId: request.residenceId,
      rankingCategoryId: request.rankingCategoryId,
      requestedBy: user.id,
    });
    return this.createPositionRequestCommandHandler.handle(command);
  }

  @Patch(':id/status')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_UPDATE)
  @ApiOperation({ summary: 'Update position request status' })
  async update(
    @Req() req,
    @Body() request: UpdatePositionRequestStatusRequest,
    @Param('id') id: string
  ) {
    const command = new UpdatePositionRequestStatusCommand(id, request.status);
    return this.updatePositionRequestStatusCommandHandler.handle(command);
  }

  @Delete(':id')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_DELETE)
  @ApiOperation({ summary: 'Delete position request' })
  async delete(@Param('id') id: string) {
    return this.deletePositionRequestCommandHandler.handle(id);
  }
}
