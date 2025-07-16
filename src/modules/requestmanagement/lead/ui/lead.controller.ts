import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeleteLeadCommandHandler } from '../application/handler/delete-lead.command.handler';
import { LeadMapper } from './mapper/lead.mapper';
import { Lead } from '../domain/lead.entity';
import { CreateLeadRequest } from './request/create-lead.request';
import { OrderByDirection } from 'objection';
import { FetchLeadsQuery } from '../application/command/fetch-leads.query';
import { UpdateLeadStatusRequest } from './request/update-lead-status.request';
import { FindLeadByIdCommandQuery } from '../application/query/find-lead-by-id.command.query';
import { FetchLeadsCommandQuery } from '../application/query/fetch-leads.command.query';
import { UpdateLeadStatusCommandHandler } from '../application/handler/update-lead-status.command.handler';
import { UpdateLeadRequest } from './request/update-lead.request';
import { UpdateLeadCommandHandler } from '../application/handler/update-lead.command.handler';
import { CreateLeadCommandHandler } from '../application/handler/create-lead-command.handler';
import { LeadResponse } from './response/lead.response';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { User } from 'src/modules/user/domain/user.entity';
import { RBACGuard } from 'src/shared/guards/rbac.guard';

@ApiTags('Leads')
@Controller('leads')
export class LeadController {
  constructor(
    private readonly fetchLeadsCommandQuery: FetchLeadsCommandQuery,
    private readonly findLeadByIdCommandQuery: FindLeadByIdCommandQuery,
    private readonly createLeadCommandHandler: CreateLeadCommandHandler,
    private readonly updateLeadStatusCommandHandler: UpdateLeadStatusCommandHandler,
    private readonly updateLeadCommandHandler: UpdateLeadCommandHandler,
    private readonly deleteLeadCommandHandler: DeleteLeadCommandHandler
  ) {}

  @Get()
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_READ, PermissionsEnum.LEADS_READ_OWN)
  @ApiOperation({ summary: 'Get all leads' })
  @ApiResponse({ type: [LeadResponse] })
  async fetchAll(
    @Req() req,
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: OrderByDirection = 'desc',
    @Query('firstName') firstName?: string[],
    @Query('lastName') lastName?: string[],
    @Query('email') email?: string[],
    @Query('status') status?: string[],
    @Query('entityId') entityId?: string,
    @Query('companyId') companyId?: string
  ) {
    const user = req.user as User;

    const { data, pagination } = await this.fetchLeadsCommandQuery.handle(
      user,
      new FetchLeadsQuery(
        query,
        page,
        limit,
        sortBy,
        sortOrder,
        firstName,
        lastName,
        email,
        status,
        entityId,
        companyId
      )
    );

    const mappedLeads = data.map((lead: Lead) => LeadMapper.toResponse(lead));

    return {
      data: mappedLeads,
      pagination,
    };
  }

  @Get(':id')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_READ, PermissionsEnum.LEADS_READ_OWN)
  @ApiOperation({ summary: 'Get lead by ID' })
  @ApiResponse({ type: LeadResponse })
  async findById(@Req() req, @Param('id') id: string) {
    const user = req.user as User;
    const lead = await this.findLeadByIdCommandQuery.handle(user, id);

    return LeadMapper.toResponse(lead);
  }

  @Post()
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_READ)
  @ApiOperation({ summary: 'Create a lead' })
  @ApiResponse({ type: LeadResponse })
  async create(@Body() lead: CreateLeadRequest) {
    const command = LeadMapper.toCreateCommand(lead);
    const createdLead = await this.createLeadCommandHandler.handle(command);

    return LeadMapper.toResponse(createdLead);
  }

  @Patch(':id/status')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_READ)
  @ApiOperation({ summary: 'Update a lead status' })
  @ApiResponse({ type: LeadResponse })
  async updateStatus(@Param('id') id: string, @Body() lead: UpdateLeadStatusRequest) {
    const command = LeadMapper.toUpdateStatusCommand(id, lead);
    const updatedLead = await this.updateLeadStatusCommandHandler.handle(command);

    return LeadMapper.toResponse(updatedLead);
  }

  @Put(':id')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_READ)
  @ApiOperation({ summary: 'Update a lead' })
  @ApiResponse({ type: LeadResponse })
  async update(@Param('id') id: string, @Body() lead: UpdateLeadRequest) {
    const command = LeadMapper.toUpdateCommand(id, lead);
    const updatedLead = await this.updateLeadCommandHandler.handle(command);

    return LeadMapper.toResponse(updatedLead);
  }

  @Delete(':id')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_READ)
  @ApiOperation({ summary: 'Delete a lead' })
  async delete(@Param('id') id: string) {
    return this.deleteLeadCommandHandler.handle(id);
  }
}
