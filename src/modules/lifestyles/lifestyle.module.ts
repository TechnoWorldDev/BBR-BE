import { Module } from '@nestjs/common';
import { IMediaRepository } from '../media/domain/media.repository.interface';
import { MediaRepositoryImpl } from '../media/infrastructure/media.repository';
import { MediaModule } from '../media/media.module';
import { CreateLifestyleCommandHandler } from './application/handlers/create-lifestyle.command.handler';
import { DeleteLifestyleCommandHandler } from './application/handlers/delete-lifestyle.command.handler';
import { UpdateLifestyleCommandHandler } from './application/handlers/update-lifestyle.command.handler';
import { FetchAllLifestylesQueryHandler } from './application/query/fetch-all-lifestyles.query.handler';
import { FindByIdLifestyleQueryHandler } from './application/query/find-by-id-lifestyle.query.handler';
import { ILifestyleRepository } from './domain/lifestyle.repository.interface';
import { LifestyleRepositoryIml } from './infrastructure/lifestyle.repository';
import { LifestyleController } from './ui/lifestyle.controller';

@Module({
  imports: [MediaModule],
  controllers: [LifestyleController],
  providers: [
    {
      provide: ILifestyleRepository,
      useClass: LifestyleRepositoryIml,
    },
    {
      provide: IMediaRepository,
      useClass: MediaRepositoryImpl,
    },
    CreateLifestyleCommandHandler,
    UpdateLifestyleCommandHandler,
    DeleteLifestyleCommandHandler,
    FetchAllLifestylesQueryHandler,
    FindByIdLifestyleQueryHandler,
  ],
})
export class LifestyleModule {}
