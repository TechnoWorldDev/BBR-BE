import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { CreateBrandTypesCommandHandler } from './application/handlers/create-brand-type.command.handler';
import { DeleteBrandTypeCommandHandler } from './application/handlers/delete-brand-type.command.handler';
import { UpdateBrandTypeCommandHandler } from './application/handlers/update-brand-type.command.handler';
import { FetchAllBrandTypesQueryHandler } from './application/query/fetch-all-brand-types.query.handler';
import { FindByIdBrandTypeQueryHandler } from './application/query/find-by-id-brand-type.query.handler';
import { IBrandTypesRepository } from './domain/brand-type.repository.interface';
import { BrandTypesRepository } from './infrastructure/brand-types.repository';
import { BrandTypesController } from './ui/brand-type.controller';
import { BrandTypesPublicController } from './ui/brand-type.public.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [BrandTypesController, BrandTypesPublicController],
  providers: [
    {
      provide: IBrandTypesRepository,
      useClass: BrandTypesRepository,
    },
    FetchAllBrandTypesQueryHandler,
    FindByIdBrandTypeQueryHandler,
    CreateBrandTypesCommandHandler,
    UpdateBrandTypeCommandHandler,
    DeleteBrandTypeCommandHandler,
  ],
})
export class BrandTypesModule {}
