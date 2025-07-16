import { Module } from '@nestjs/common';
import { CreateRankingCategoryTypeCommandHandler } from './application/handler/create-ranking-category-type.command.handler';
import { FetchRankingCategoryTypesCommandQuery } from './application/query/fetch-ranking-category-types.command.query';
import { UpdateRankingCategoryTypeCommandHandler } from './application/handler/update-ranking-category-type.command.handler';
import { DeleteRankingCategoryTypeCommandHandler } from './application/handler/delete-ranking-category-type.command.handler';
import { RankingCategoryTypeController } from './ui/ranking-category-type.controller';
import { RankingCategoryTypeRepositoryImpl } from './infrastructure/ranking-category-type.repository';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { IRankingCategoryTypeRepository } from './domain/ranking-category-type.repository.interface';
import { RankingCategoryTypeMapper } from './ui/mapper/category-type.mapper';
import { FindRankingCategoryTypeByIdCommandQuery } from './application/query/find-ranking-category-type-by-id.command.query';

@Module({
  imports: [DatabaseModule],
  controllers: [RankingCategoryTypeController],
  providers: [
    {
      provide: IRankingCategoryTypeRepository,
      useClass: RankingCategoryTypeRepositoryImpl,
    },
    CreateRankingCategoryTypeCommandHandler,
    FetchRankingCategoryTypesCommandQuery,
    FindRankingCategoryTypeByIdCommandQuery,
    UpdateRankingCategoryTypeCommandHandler,
    DeleteRankingCategoryTypeCommandHandler,
    RankingCategoryTypeMapper,
  ],
})
export class RankingCategoryTypeModule {}
