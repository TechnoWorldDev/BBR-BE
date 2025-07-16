import { Module } from '@nestjs/common';
import { IRankingCategoryRepository } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category.repository.interface';
import { RankingCategoryRepositoryImpl } from 'src/modules/shared/rankingmanagement/category/infrastructure/ranking-category.repository';
import { IRankingCriteriaRepository } from 'src/modules/shared/rankingmanagement/criteria/domain/ranking-criteria.repository.interface';
import { RankingCriteriaRepositoryImpl } from 'src/modules/shared/rankingmanagement/criteria/infrastructure/ranking-criteria.repository';
import { IResidenceRepository } from '../residence/domain/residence.repository.interface';
import { ResidenceRepositoryImpl } from '../unit/infrastructure/residence.repository';
import { ScoreMultipleResidencesCommandHandler } from './application/handlers/score-residence-multiple.command.handler';
import { ScoreResidenceCommandHandler } from './application/handlers/score-residence.command.handler';
import { FetchScoresResidenceCommandQuery } from './application/query/fetch-scores-residence.command.query';
import { IRankingScoreRepository } from './domain/residence-ranking-score.repository.interface';
import { ResidenceRankingScoreRepositoryImpl } from './infrastructure/residence-ranking-score.repository';
import { ResidenceRankingScoreController } from './ui/residence-ranking-score.controller';
import { RemoveResidenceScoreFromCategoryCommandHandler } from './application/handlers/remove-residence-score-from-category.command.handler';

@Module({
  controllers: [ResidenceRankingScoreController],
  providers: [
    {
      provide: IRankingScoreRepository,
      useClass: ResidenceRankingScoreRepositoryImpl,
    },
    {
      provide: IRankingCategoryRepository,
      useClass: RankingCategoryRepositoryImpl,
    },
    {
      provide: IResidenceRepository,
      useClass: ResidenceRepositoryImpl,
    },
    {
      provide: IRankingCriteriaRepository,
      useClass: RankingCriteriaRepositoryImpl,
    },
    ScoreResidenceCommandHandler,
    ScoreMultipleResidencesCommandHandler,
    RemoveResidenceScoreFromCategoryCommandHandler,
    FetchScoresResidenceCommandQuery,
  ],
  exports: [],
})
export class ResidenceRankingScoreModule {}
