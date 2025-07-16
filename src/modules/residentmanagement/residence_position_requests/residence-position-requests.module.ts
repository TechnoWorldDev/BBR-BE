import { Module } from '@nestjs/common';
import { IUserRepository } from './domain/user.repository.interface';
import { UserRepositoryImpl } from './infrastructure/user.repository.impl';
import { IResidenceRepository } from './domain/residence.repository.interface';
import { ResidenceRepositoryImpl } from './infrastructure/residence.repository.impl';
import { IRankingCategoryRepository } from './domain/ranking-category.repository.interface';
import { RankingCategoryRepositoryImpl } from './infrastructure/ranking-category.repository.impl';
import { CreatePositionRequestCommandHandler } from './application/handler/create-position-request.command.handler';
import { ResidencePositionRequestsController } from './ui/residence-position-requests.controller';
import { IResidencePositionRequestsRepository } from './domain/residence-position-requests.repository.interface';
import { ResidencePositionRequestsRepositoryImpl } from './infrastructure/residence-position-requests.repository.impl';
import { fetchPositionRequestsCommandQuery } from './application/query/fetch-position-requests.command.query';
import { UpdatePositionRequestStatusCommandHandler } from './application/handler/update-position-request-status.command.handler';
import EmailModule from 'src/modules/email/email.module';
import { DeletePositionRequestCommandHandler } from './application/handler/delete-position-request.command.handler';

@Module({
  controllers: [ResidencePositionRequestsController],
  imports: [EmailModule],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: IResidenceRepository,
      useClass: ResidenceRepositoryImpl,
    },
    {
      provide: IRankingCategoryRepository,
      useClass: RankingCategoryRepositoryImpl,
    },
    {
      provide: IResidencePositionRequestsRepository,
      useClass: ResidencePositionRequestsRepositoryImpl,
    },
    CreatePositionRequestCommandHandler,
    UpdatePositionRequestStatusCommandHandler,
    DeletePositionRequestCommandHandler,
    fetchPositionRequestsCommandQuery,
  ],
  exports: [],
})
export class ResidencePositionRequestsModule {}
