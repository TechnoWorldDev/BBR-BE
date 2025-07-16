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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RankingCriteriaResponse } from './response/ranking-criteria.response';
import { FindAllRankingCriteriaForResidenceQueryHandler } from '../application/query/find-all-ranking-criteria-residence-category.query.handler';
import { FetchAllRankingCriteriaForResidenceQuery } from '../application/commands/fetch-ranking-criteria-for-residence.query';
import { RankingCriteriaMapper } from './mappers/ranking-criteria.mapper';
import { FindAllRankingCriteriaQueryHandler } from '../application/query/find-all-ranking-criteria.query.handler';
import { OrderByDirection } from 'objection';
import { FetchRankingCriteriaQuery } from '../application/commands/fetch-ranking-criteria.query';
import { RankingCriteria } from '../domain/ranking-criteria.entity';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { CreateRankingCriteriaRequest } from './request/create-criteria.request';
import { CreateRankingCriteriaCommandHandler } from '../application/handlers/create-ranking-criteria-command.handler';
import { CreateRankingCriteriaCommand } from '../application/commands/create-ranking-criteria.command';
import { RBACGuard } from 'src/shared/guards/rbac.guard';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { UpdateRankingCriteriaCommand } from '../application/commands/update-ranking-criteria.command';
import { updateRankingCriteriaRequest } from './request/update-criteria.request';
import { UpdateRankingCriteriaCommandHandler } from '../application/handlers/update-ranking-criteria-command.handler';
import { DeleteRankingCriteriaCommandHandler } from '../application/handlers/delete-ranking-criteria-command.handler';

@ApiTags('Ranking Criteria')
@Controller('ranking-criteria')
export class RankingCriteriaController {
  constructor(
    private readonly findAllRankingCriteriaForResidenceCommandQuery: FindAllRankingCriteriaForResidenceQueryHandler,
    private readonly FindAllRankingCriteriaQueryHandler: FindAllRankingCriteriaQueryHandler,
    private readonly createRankingCriteriaCommandHandler: CreateRankingCriteriaCommandHandler,
    private readonly updateRankingCriteriaCommandHandler: UpdateRankingCriteriaCommandHandler,
    private readonly deleteRankingCriteriaCommandHandler: DeleteRankingCriteriaCommandHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all criteria' })
  @ApiResponse({
    status: 200,
    description: 'List of criteria',
    type: [RankingCriteriaResponse],
  })
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection
  ) {
    const { data, pagination } = await this.FindAllRankingCriteriaQueryHandler.handle(
      new FetchRankingCriteriaQuery(query, page, limit, sortBy, sortOrder)
    );

    const mappedCriteria = data.map((criteria: RankingCriteria) =>
      RankingCriteriaMapper.toResponse(criteria)
    );
    return {
      data: mappedCriteria,
      pagination,
    };
  }

  @Get('/residences/:residenceId/categories/:categoryId')
  @ApiOperation({ summary: 'Get criteria for residence by category' })
  @ApiResponse({
    status: 200,
    description: 'List of criteria for a residence and category',
    type: [RankingCriteriaResponse],
  })
  async getForResidenceAndCategory(
    @Param('residenceId') residenceId: string,
    @Param('categoryId') categoryId: string
  ): Promise<RankingCriteriaResponse[]> {
    const query = new FetchAllRankingCriteriaForResidenceQuery(residenceId, categoryId);

    const data = await this.findAllRankingCriteriaForResidenceCommandQuery.handle(query);

    const mappedCriteria = data.map((criteria: RankingCriteria) =>
      RankingCriteriaMapper.toResponse(criteria)
    );

    return mappedCriteria;
  }

  @Post()
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN)
  @ApiOperation({ summary: 'Create a new criteria' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: RankingCriteriaResponse,
  })
  async create(
    @Body() createRankingCriteriaRequest: CreateRankingCriteriaRequest
  ): Promise<RankingCriteriaResponse> {
    const command = new CreateRankingCriteriaCommand(
      createRankingCriteriaRequest.name,
      createRankingCriteriaRequest.description,
      createRankingCriteriaRequest.isDefault
    );

    const rankingCriteria = await this.createRankingCriteriaCommandHandler.handle(command);
    return RankingCriteriaMapper.toResponse(rankingCriteria);
  }

  @Put(':id')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN)
  @ApiOperation({ summary: 'Update a criteria' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: RankingCriteriaResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() updateRankingCriteriaRequest: updateRankingCriteriaRequest
  ) {
    const command = new UpdateRankingCriteriaCommand(
      updateRankingCriteriaRequest.name,
      updateRankingCriteriaRequest.description,
      updateRankingCriteriaRequest.isDefault
    );

    return await this.updateRankingCriteriaCommandHandler.handle(id, command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN)
  @ApiOperation({ summary: 'Delete a criteria' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteRankingCriteriaCommandHandler.handle(id);
  }
}
