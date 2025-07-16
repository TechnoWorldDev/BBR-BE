import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { ReviewController } from './ui/review.controller';
import { IReviewRepository } from './domain/ireview.repository.interface';
import { ReviewRepositoryImpl } from './infrastructure/review.repository.impl';
import { IResidenceRepository } from './domain/residence.repository.interface';
import { ResidenceRepositoryImpl } from './infrastructure/residence.repository';
import { IUserRepository } from './domain/user.repository.interface';
import { UserRepositoryImpl } from './infrastructure/user.repository';
import { CreateReviewCommandHandler } from './application/handler/create-review-command.handler';
import { UpdateReviewStatusCommandHandler } from './application/handler/update-review-status-command.handler';
import { DeleteReviewCommandHandler } from './application/handler/delete-review-command.handler';
import { FetchReviewsCommandQuery } from './application/query/fetch-reviews-command.query';
import { FindReviewByIdCommandQuery } from './application/query/find-review-by-id-command.query';
import { ReviewMapper } from './ui/mapper/review.mapper';
import { IUnitTypeRepository } from './domain/unit-type.repository.interface';
import { UnitTypeRepositoryImpl } from './infrastructure/unit-type.repository';
import EmailModule from 'src/modules/email/email.module';

@Module({
  imports: [DatabaseModule, EmailModule],
  controllers: [ReviewController],
  providers: [
    {
      provide: IReviewRepository,
      useClass: ReviewRepositoryImpl,
    },
    {
      provide: IResidenceRepository,
      useClass: ResidenceRepositoryImpl,
    },
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: IUnitTypeRepository,
      useClass: UnitTypeRepositoryImpl,
    },
    CreateReviewCommandHandler,
    UpdateReviewStatusCommandHandler,
    DeleteReviewCommandHandler,
    FetchReviewsCommandQuery,
    FindReviewByIdCommandQuery,
    ReviewMapper,
  ],
})
export class ReviewModule {}
