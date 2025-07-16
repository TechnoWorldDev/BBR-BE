import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { IBrandTypesRepository } from '../brand_type/domain/brand-type.repository.interface';
import { BrandTypesRepository } from '../brand_type/infrastructure/brand-types.repository';
import { MediaModule } from '../media/media.module';
import { CreateBrandCommandHandler } from './application/handlers/create-brand.command.handler';
import { DeleteBrandCommandHandler } from './application/handlers/delete-brand.command.handler';
import { UpdateBrandStatusCommandHandler } from './application/handlers/update-brand-status.command.handler';
import { UpdateBrandCommandHandler } from './application/handlers/update-brand.command.handler';
import { IBrandRepository } from './domain/brand.repository.interface';
import { BrandRepositoryImpl } from './infrastructure/brand.repository';
import { BrandController } from './ui/brand.controller';
import { BrandMapper } from './ui/mappers/brand.mapper';
import { FindByIdBrandQueryHandler } from './application/query/find-by-id-brand.query.handler';
import { FetchAllBrandQueryHandler } from './application/query/fetch-all-brands.query.handler';
import { BrandPublicController } from './ui/brand.public.controller';
import { FindBySlugBrandQueryHandler } from './application/query/find-by-slug-brand.query.handler';
import { FetchAllBrandPublicQueryHandler } from './application/query/fetch-all-brands.public.query.handler';

@Module({
  imports: [DatabaseModule, MediaModule],
  controllers: [BrandController, BrandPublicController],
  providers: [
    {
      provide: IBrandRepository,
      useClass: BrandRepositoryImpl,
    },
    {
      provide: IBrandTypesRepository,
      useClass: BrandTypesRepository,
    },
    CreateBrandCommandHandler,
    FindByIdBrandQueryHandler,
    FindBySlugBrandQueryHandler,
    FetchAllBrandPublicQueryHandler,
    FetchAllBrandQueryHandler,
    UpdateBrandCommandHandler,
    DeleteBrandCommandHandler,
    UpdateBrandStatusCommandHandler,
    BrandMapper,
  ],
})
export class BrandModule {}
