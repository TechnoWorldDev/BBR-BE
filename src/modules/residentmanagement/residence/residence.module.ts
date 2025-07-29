import { Module } from '@nestjs/common';
import { IBrandRepository } from 'src/modules/brand/domain/brand.repository.interface';
import { BrandRepositoryImpl } from 'src/modules/brand/infrastructure/brand.repository';
import { ICompanyRepository } from 'src/modules/company/domain/company.repository.interface';
import { CompanyRepository } from 'src/modules/company/infrastructure/company.repository';
import EmailModule from 'src/modules/email/email.module';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { MediaRepositoryImpl } from 'src/modules/media/infrastructure/media.repository';
import { ICityRepository } from 'src/modules/shared/city/domain/city.repository.interface';
import { CityRepositoryImpl } from 'src/modules/shared/city/infrastructure/city.repository';
import { ICountryRepository } from 'src/modules/shared/country/domain/country.repository.interface';
import { CountryRepositoryImpl } from 'src/modules/shared/country/infrastructure/country.repository';
import { IRankingCategoryRepository } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category.repository.interface';
import { RankingCategoryRepositoryImpl } from 'src/modules/shared/rankingmanagement/category/infrastructure/ranking-category.repository';
import { IAmenityRepository } from '../amenity/domain/amenity.repository.interface';
import { AmenityRepositoryImpl } from '../amenity/infrastructure/amenity.repository';
import { IKeyFeatureRepository } from '../key_feature/domain/key-feature.repository.interface';
import { KeyFeatureRepository } from '../key_feature/infrastructure/key-feature.repository';
import { CreateResidenceCommandHandler } from './application/handlers/create-residence.command.handler';
import { DeleteResidenceCommandHandler } from './application/handlers/delete-residence.command.handler';
import { UpdateResidenceCommandHandler } from './application/handlers/update-residence.command.handler';
import { UpdateResidenceStatusCommandHandler } from './application/handlers/update-status-residence.command.handler';
import { FetchResidencesByUserCommandQuery } from './application/query/fetch-residences-by-user.command.query';
import { FindAllResidencesCommandQuery } from './application/query/find-all-residences.query';
import { FindAllUnassignedResidencesCommandQuery } from './application/query/find-all-unassigned-residences.query';
import { FindByIdResidenceCommandQuery } from './application/query/find-by-id-residence.query';
import { FindBySlugResidenceCommandQuery } from './application/query/find-by-slug-residence.query';
import { IResidenceRepository } from './domain/residence.repository.interface';
import { ResidenceRepository } from './infrastructure/residence.repository';
import { ResidenceController } from './ui/residence.controller';
import { ResidencePublicController } from './ui/residence.public.controller';
import { IUserRepository } from './domain/user.repository.interface';
import { UserRepositoryImpl } from './infrastructure/user.repository.impl';
import { PublicApplyForRankingController } from './ui/public-apply-for-ranking.controller';
import { PublicApplyForRankingService } from './services/public-apply-for-ranking.service';
import { UserModule } from 'src/modules/user/user.module';
import { BillingModule } from 'src/modules/billing/billing.module';
import { StripeModule } from 'src/shared/stripe/stripe.module';
import { ResidencePositionRequestsModule } from '../residence_position_requests/residence-position-requests.module';

@Module({
  imports: [EmailModule, UserModule, BillingModule, StripeModule, ResidencePositionRequestsModule],
  controllers: [ResidenceController, ResidencePublicController, PublicApplyForRankingController],
  providers: [
    {
      provide: IResidenceRepository,
      useClass: ResidenceRepository,
    },
    {
      provide: IRankingCategoryRepository,
      useClass: RankingCategoryRepositoryImpl,
    },
    {
      provide: ICountryRepository,
      useClass: CountryRepositoryImpl,
    },
    {
      provide: ICityRepository,
      useClass: CityRepositoryImpl,
    },
    {
      provide: IMediaRepository,
      useClass: MediaRepositoryImpl,
    },
    {
      provide: ICompanyRepository,
      useClass: CompanyRepository,
    },
    {
      provide: IBrandRepository,
      useClass: BrandRepositoryImpl,
    },
    {
      provide: IAmenityRepository,
      useClass: AmenityRepositoryImpl,
    },
    {
      provide: IKeyFeatureRepository,
      useClass: KeyFeatureRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
    PublicApplyForRankingService,
    FindAllResidencesCommandQuery,
    FindAllUnassignedResidencesCommandQuery,
    FindByIdResidenceCommandQuery,
    FetchResidencesByUserCommandQuery,
    CreateResidenceCommandHandler,
    UpdateResidenceCommandHandler,
    UpdateResidenceStatusCommandHandler,
    DeleteResidenceCommandHandler,
    FindBySlugResidenceCommandQuery,
  ],
  exports: [],
})
export class ResidenceModule {}
