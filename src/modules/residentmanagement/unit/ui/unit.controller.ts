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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderByDirection } from 'objection';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { RBACGuard } from 'src/shared/guards/rbac.guard';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { FetchUnitsQuery } from '../application/command/fetch-units.query';
import { UpdateUnitStatusCommand } from '../application/command/update-unit-status.command';
import { CreateUnitCommandHandler } from '../application/handler/create-unit.command.handler';
import { DeleteUnitCommandHandler } from '../application/handler/delete-unit.command.handler';
import { UpdateUnitStatusCommandHandler } from '../application/handler/update-unit-status.command.handler';
import { UpdateUnitCommandHandler } from '../application/handler/update-unit.command.handler';
import { FetchUnitsCommandQuery } from '../application/query/fetch-units.query';
import { FindUnitByIdCommandQuery } from '../application/query/find-by-id-unit.query';
import { UnitStatusEnum } from '../domain/unit-status.enum';
import { Unit } from '../domain/unit.entity';
import { UnitMapper } from './mapper/unit.mapper';
import { CreateUnitRequest } from './request/create-unit.request';
import { UpdateUnitRequest } from './request/update-unit.request';
import { UnitResponse } from './response/unit.response';
import { User } from 'src/modules/user/domain/user.entity';
import { Permission } from '@aws-sdk/client-s3';

@ApiTags('Units')
@Controller('units')
export class UnitController {
  constructor(
    private readonly fetchUnitsCommandQuery: FetchUnitsCommandQuery,
    private readonly findUnitByIdCommandQuery: FindUnitByIdCommandQuery,
    private readonly createUnitCommandHandler: CreateUnitCommandHandler,
    private readonly updateUnitCommandHandler: UpdateUnitCommandHandler,
    private readonly deleteUnitCommandHandler: DeleteUnitCommandHandler,
    private readonly updateUnitStatusCommandHandler: UpdateUnitStatusCommandHandler
  ) {}

  @Get()
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_READ, PermissionsEnum.UNITS_READ_OWN)
  @ApiOperation({ summary: 'Get all units' })
  @ApiResponse({ type: [UnitResponse] })
  async fetchAll(
    @Req() req,
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('unitTypeId') unitTypeId?: string[],
    @Query('residenceId') residenceId?: string[],
    @Query('status') status?: UnitStatusEnum[]
  ) {
    const user = req.user as User;
    const { data, pagination } = await this.fetchUnitsCommandQuery.handle(
      user,
      new FetchUnitsQuery(query, page, limit, sortBy, sortOrder, residenceId, unitTypeId, status)
    );

    const mappedUnits = data.map((unit: Unit) => UnitMapper.toResponse(unit));

    return {
      data: mappedUnits,
      pagination,
    };
  }

  @Get(':id')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN, PermissionsEnum.UNITS_READ_OWN)
  @ApiOperation({ summary: 'Get unit by ID' })
  @ApiResponse({ type: UnitResponse })
  async findById(@Param('id') id: string) {
    const unit = await this.findUnitByIdCommandQuery.handle(id);

    return UnitMapper.toResponse(unit);
  }

  @Post()
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN, PermissionsEnum.UNITS_CREATE_OWN)
  @ApiOperation({ summary: 'Create a unit' })
  @ApiResponse({ type: UnitResponse })
  async create(@Req() Req, @Body() createUnitRequest: CreateUnitRequest) {
    const user = Req.user as User;
    const command = UnitMapper.toCreateCommand(createUnitRequest);
    const createdUnit = await this.createUnitCommandHandler.handle(user, command);

    return UnitMapper.toResponse(createdUnit);
  }

  @Patch(':id/status')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update a unit status' })
  @ApiResponse({ type: UnitResponse })
  async updateStatus(@Param('id') id: string, @Body('status') status: UnitStatusEnum) {
    const command = new UpdateUnitStatusCommand(id, status);
    await this.updateUnitStatusCommandHandler.handle(command);
  }

  @Put(':id')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN, PermissionsEnum.UNITS_UPDATE_OWN)
  @ApiOperation({ summary: 'Update a unit' })
  @ApiResponse({ type: UnitResponse })
  async update(@Req() req, @Param('id') id: string, @Body() updateUnitRequest: UpdateUnitRequest) {
    const user = req.user as User;
    const command = UnitMapper.toUpdateCommand(id, updateUnitRequest);
    const updatedUnit = await this.updateUnitCommandHandler.handle(user, command);

    return UnitMapper.toResponse(updatedUnit);
  }

  @Delete(':id')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN, PermissionsEnum.UNITS_DELETE_OWN)
  @ApiOperation({ summary: 'Delete a unit' })
  async delete(@Req() req, @Param('id') id: string) {
    const user = req.user as User;
    return this.deleteUnitCommandHandler.handle(user, id);
  }
}
