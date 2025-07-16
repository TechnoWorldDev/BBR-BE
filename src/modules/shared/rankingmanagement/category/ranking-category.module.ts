import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { IRankingCategoryRepository } from './domain/ranking-category.repository.interface';
import { RankingCategoryRepositoryImpl } from './infrastructure/ranking-category.repository';
import { RankingCategoryController } from './ui/ranking-category.controller';
import { CreateRankingCategoryCommandHandler } from './application/handler/create-ranking-category.command.handler';
import { FindRankingCategoryByIdCommandQuery } from './application/query/find-by-id-ranking-category.query';
import { FetchRankingCategoriesCommandQuery } from './application/query/fetch-ranking-categories.query';
import { UpdateRankingCategoryCommandHandler } from './application/handler/update-ranking-category.command.handler';
import { DeleteRankingCategoryCommandHandler } from './application/handler/delete-ranking-category.command.handler';
import { UpdateRankingCategoryStatusCommandHandler } from './application/handler/update-ranking-category-status.command.handler';
import { RankingCategoryMapper } from './ui/mapper/ranking-category.mapper';
import { MediaModule } from '../../../media/media.module';
import { IRankingCategoryTypeRepository } from '../categorytype/domain/ranking-category-type.repository.interface';
import { RankingCategoryTypeRepositoryImpl } from '../categorytype/infrastructure/ranking-category-type.repository';
import { AssignWeightsToRankingCategoryCommandHandler } from './application/handler/assign-weights-to-ranking-category.command.handler';
import { IRankingCriteriaRepository } from '../criteria/domain/ranking-criteria.repository.interface';
import { RankingCriteriaRepositoryImpl } from '../criteria/infrastructure/ranking-criteria.repository';
import { AssignResidencesToRankingCategoryCommandHandler } from './application/handler/assign-residences-to-ranking-category.command.handler';
import { IRankingScoreRepository } from 'src/modules/residentmanagement/ranking_score/domain/residence-ranking-score.repository.interface';
import { ResidenceRankingScoreRepositoryImpl } from 'src/modules/residentmanagement/ranking_score/infrastructure/residence-ranking-score.repository';
import { FindRankingCategoryBySlugCommandQuery } from './application/query/find-by-slug-ranking-category.query';
import { RankingCategoryPublicController } from './ui/ranking-category.public.controller';
import { FetchResidencesByCategoryCommandQuery } from './application/query/fetch-residences-by-category.query';
import { FetchResidencesByCategoryIdCommandQuery } from './application/query/fetch-residences-by-category-id.query';
import { FetchRankingCategoriesByUserCommandQuery } from './application/query/fetch-ranking-categories-by-user.query';
@Module({
  imports: [DatabaseModule, MediaModule],
  controllers: [RankingCategoryController, RankingCategoryPublicController],
  providers: [
    {
      provide: IRankingCategoryRepository,
      useClass: RankingCategoryRepositoryImpl,
    },
    {
      provide: IRankingCategoryTypeRepository,
      useClass: RankingCategoryTypeRepositoryImpl,
    },
    {
      provide: IRankingCriteriaRepository,
      useClass: RankingCriteriaRepositoryImpl,
    },
    {
      provide: IRankingScoreRepository,
      useClass: ResidenceRankingScoreRepositoryImpl,
    },
    CreateRankingCategoryCommandHandler,
    FindRankingCategoryByIdCommandQuery,
    FetchRankingCategoriesCommandQuery,
    FindRankingCategoryBySlugCommandQuery,
    FetchResidencesByCategoryCommandQuery,
    FetchResidencesByCategoryIdCommandQuery,
    FetchRankingCategoriesByUserCommandQuery,
    UpdateRankingCategoryCommandHandler,
    UpdateRankingCategoryStatusCommandHandler,
    DeleteRankingCategoryCommandHandler,
    RankingCategoryMapper,
    AssignWeightsToRankingCategoryCommandHandler,
    AssignResidencesToRankingCategoryCommandHandler,
  ],
})
export class RankingCategoryModule {}
