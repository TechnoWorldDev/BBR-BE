import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { RBACGuard } from 'src/shared/guards/rbac.guard';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { RemoveResidenceScoreFromCategoryCommand } from '../application/commands/remove-residence-score-from-category.command';
import { ScoreMultipleResidencesCommand } from '../application/commands/score-residence-multiple.command';
import { ScoreResidenceCommand } from '../application/commands/score-residence.command';
import { RemoveResidenceScoreFromCategoryCommandHandler } from '../application/handlers/remove-residence-score-from-category.command.handler';
import { ScoreMultipleResidencesCommandHandler } from '../application/handlers/score-residence-multiple.command.handler';
import { ScoreResidenceCommandHandler } from '../application/handlers/score-residence.command.handler';
import { FetchScoresResidenceCommandQuery } from '../application/query/fetch-scores-residence.command.query';
import { ScoreMultipleResidencesRequest } from './request/score-residence-multiple.request';
import { ScoreResidenceRequest } from './request/score-residence.request';

@ApiTags('Residence Ranking Score')
@Controller('residence-scores')
export class ResidenceRankingScoreController {
  constructor(
    private readonly scoreResidenceCommandHandler: ScoreResidenceCommandHandler,
    private readonly fetchScoresResidenceCommandQuery: FetchScoresResidenceCommandQuery,
    private readonly scoreMultipleResidencesCommandHandler: ScoreMultipleResidencesCommandHandler,
    private readonly removeResidenceScoreFromCategoryCommandHandler: RemoveResidenceScoreFromCategoryCommandHandler
  ) {}

  @Post('multiple')
  @ApiOperation({ summary: 'Multiple residences scoring' })
  async scoreResidences(@Body() request: ScoreMultipleResidencesRequest) {
    const command = new ScoreMultipleResidencesCommand(request.items);

    await this.scoreMultipleResidencesCommandHandler.handle(command);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Score residence' })
  async scoreResidence(@Param('id') residenceId: string, @Body() request: ScoreResidenceRequest) {
    const command = new ScoreResidenceCommand(residenceId, request.scores);

    return await this.scoreResidenceCommandHandler.handle(command);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get residence scores' })
  async getResidenceScores(@Param('id') residenceId: string) {
    return await this.fetchScoresResidenceCommandQuery.handle(residenceId);
  }

  @Delete(':residenceId/category/:categoryId')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_DELETE)
  @ApiOperation({ summary: 'Remove residence from ranking category' })
  async removeFromCategory(
    @Param('residenceId') residenceId: string,
    @Param('categoryId') rankingCategoryId: string
  ) {
    const command = new RemoveResidenceScoreFromCategoryCommand(residenceId, rankingCategoryId);
    await this.removeResidenceScoreFromCategoryCommandHandler.handle(command);
  }
}
