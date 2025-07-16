import { Module } from '@nestjs/common';

import { ContinentController } from './ui/continent.controller';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { IContinentRepository } from './domain/continent.repository.interface';
import { ContinentRepositoryImpl } from './infrastrucure/continent.repository';
import { CreateContinentCommandHandler } from './application/handler/create-continent.command.handler';
import { FindContinentByIdCommandQuery } from './application/query/find-continent-by-id.command.query';
import { FetchContinentsCommandQuery } from './application/query/fetch-continents.command.query';
import { UpdateContinentCommandHandler } from './application/handler/update-continent.command.handler';
import { DeleteContinentCommandHandler } from './application/handler/delete-continent.command.handler';
import { ContinentPublicController } from './ui/continent.public.controller';
import { FetchContinentsPublicCommandQuery } from './application/query/fetch-continents.public.command.query';

@Module({
  imports: [DatabaseModule],
  controllers: [ContinentController, ContinentPublicController],
  providers: [
    {
      provide: IContinentRepository,
      useClass: ContinentRepositoryImpl,
    },
    CreateContinentCommandHandler,
    FindContinentByIdCommandQuery,
    FetchContinentsCommandQuery,
    FetchContinentsPublicCommandQuery,
    UpdateContinentCommandHandler,
    DeleteContinentCommandHandler,
  ],
})
export class ContinentModule {}
