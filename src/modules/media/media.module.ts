import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AwsProperties } from 'src/shared/aws/aws-properties';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { FileUploadServiceConfiguration } from 'src/shared/media/config/file-upload-service-configuration';
import { MediaLibraryS3Configuration } from 'src/shared/media/config/media-library-s3.configuration';
import { SizeConfigurationFactory } from 'src/shared/media/config/size-configuration-factory';
import { SizeConfigurationModule } from 'src/shared/media/config/size.configuration.module';
import { MediaServiceImpl } from 'src/shared/media/media.service';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { UnusedMediaJob } from 'src/shared/media/scheduler/unused-media.job';
import { LocalMediaStorageService } from 'src/shared/media/storage/local-media.storage.service';
import { S3MediaStorage } from 'src/shared/media/storage/s3-media-storage.service';
import { BrandMediaStorageService } from '../brand/infrastructure/media/brand-media-storage.service';
import { BrandStorageConfig } from '../brand/infrastructure/media/brand-storage.config';
import { CompanyMediaStorageService } from '../company/infrastructure/media/company-media-storage.service';
import { UserMediaStorageService } from '../user/infrastructure/media/user-media-storage.service';
import { FileUploadCompletedEventHandler } from './application/eventhandler/file-upload-completed.event.handler';
import { FetchContentCommandHandler } from './application/handler/fetch-content.command.handler';
import { UploadMediaCommandHandler } from './application/handler/upload-media.command.handler';
import { FindMediaByIdCommandQuery } from './application/query/find-media-by-id.command.query';
import { FindMediaUploadStatusByIdCommandQuery } from './application/query/find-media-status-by-id.command.query';
import { FileUploadErrorEvent } from './domain/event/file-upload-error.event';
import { IMediaRepository } from './domain/media.repository.interface';
import { FileUploadService } from './infrastructure/file-upload.service';
import { MediaRepositoryImpl } from './infrastructure/media.repository';
import { MediaController } from './ui/media.controller';
import { CompanyStorageConfig } from '../company/infrastructure/media/company-storage.config';
import { UserStorageConfig } from '../user/infrastructure/media/user-storage.config';
import { LifestyleMediaStorageService } from '../lifestyles/infrastructure/media/lifestyle-media-storage.service';
import { LifestyleStorageConfig } from '../lifestyles/infrastructure/media/lifestyle-storage.config';
import { AmenityStorageConfig } from '../residentmanagement/amenity/infrastructure/media/amenity-storage.config';
import { AmenityMediaStorageService } from '../residentmanagement/amenity/infrastructure/media/amenity-media-storage.service';
import { RankingCategoryStorageConfig } from '../shared/rankingmanagement/category/infrastructure/media/ranking-category-storage.config';
import { RankingCategoryMediaStorageService } from '../shared/rankingmanagement/category/infrastructure/media/ranking-category-media-storage.service';
import { ResidenceMediaStorageService } from '../residentmanagement/residence/infrastructure/media/residence-media-storage.service';
import { ResidenceStorageConfig } from '../residentmanagement/residence/infrastructure/media/residence-storage.config';
import {
  ResidenceUnitStorageConfig
} from '../residentmanagement/unit/infrastructure/media/residence-unit-storage-config.service';
import {
  ResidenceUnitMediaStorageService
} from '../residentmanagement/unit/infrastructure/media/residence-unit-media-storage.service';
import {
  CareerContactFormStorageConfig
} from '../contactform/career/infrastructure/media/career-contact-form-storage-config.service';
import {
  CareerContactFormMediaStorageService
} from '../contactform/career/infrastructure/media/career-contact-form-media-storage.service';
import {
  ContactFormStorageConfig
} from '../contactform/contactform/infrastructure/media/contact-form-storage-config.service';
import {
  ContactFormMediaStorageService
} from '../contactform/contactform/infrastructure/media/contact-form-media-storage.service';
import {
  ClaimProfileContactFormStorageConfig
} from '../contactform/claimprofile/infrastructure/media/claim-profile-contact-form-storage-config.service';
import {
  ClaimProfileContactFormMediaStorageService
} from '../contactform/claimprofile/infrastructure/media/claim-profile-contact-form-media-storage.service';
@Global()
@Module({
  imports: [DatabaseModule, EventEmitterModule.forRoot(), SizeConfigurationModule],
  controllers: [MediaController],
  providers: [
    UnusedMediaJob,
    AwsProperties,
    MediaLibraryS3Configuration,
    FileUploadService,
    SizeConfigurationFactory,
    FileUploadServiceConfiguration,
    FileUploadCompletedEventHandler,
    FileUploadErrorEvent,
    UploadMediaCommandHandler,
    FetchContentCommandHandler,
    FindMediaUploadStatusByIdCommandQuery,
    FindMediaByIdCommandQuery,
    {
      provide: IMediaService,
      useClass: MediaServiceImpl,
    },
    {
      provide: IMediaRepository,
      useClass: MediaRepositoryImpl,
    },
    {
      provide: 'S3_MEDIA_STORAGE_SERVICE',
      useClass: S3MediaStorage,
    },
    {
      provide: 'LOCAL_MEDIA_STORAGE_SERVICE',
      useClass: LocalMediaStorageService,
    },
    {
      provide: 'MEDIA_DOMAIN_STORAGE_SERVICES',
      useFactory: (
        brandStorage: BrandMediaStorageService,
        companyStorage: CompanyMediaStorageService,
        userStorage: UserMediaStorageService,
        lifestyleStorage: LifestyleMediaStorageService,
        amenityStorage: AmenityMediaStorageService,
        rankingCategoryStorage: RankingCategoryMediaStorageService,
        residenceStorage: ResidenceMediaStorageService,
        residenceUnitStorage: ResidenceUnitMediaStorageService,
        careerContactFormStorage: CareerContactFormMediaStorageService,
        contactFormStorage: ContactFormMediaStorageService,
        claimProfileContactFormStorage: ClaimProfileContactFormMediaStorageService,
      ) => [
        brandStorage,
        companyStorage,
        userStorage,
        lifestyleStorage,
        amenityStorage,
        rankingCategoryStorage,
        residenceStorage,
        residenceUnitStorage,
        careerContactFormStorage,
        contactFormStorage,
        claimProfileContactFormStorage
      ],
      inject: [
        BrandMediaStorageService,
        CompanyMediaStorageService,
        UserMediaStorageService,
        AmenityMediaStorageService,
        RankingCategoryMediaStorageService,
        ResidenceMediaStorageService,
        ResidenceUnitMediaStorageService,
        CareerContactFormMediaStorageService,
        ContactFormMediaStorageService,
        ClaimProfileContactFormMediaStorageService,
      ],
    },
    BrandStorageConfig,
    BrandMediaStorageService,
    UserStorageConfig,
    UserMediaStorageService,
    LifestyleStorageConfig,
    LifestyleMediaStorageService,
    CompanyStorageConfig,
    CompanyMediaStorageService,
    AmenityStorageConfig,
    AmenityMediaStorageService,
    RankingCategoryStorageConfig,
    RankingCategoryMediaStorageService,
    ResidenceStorageConfig,
    ResidenceMediaStorageService,
    ResidenceUnitStorageConfig,
    ResidenceUnitMediaStorageService,
    CareerContactFormStorageConfig,
    CareerContactFormMediaStorageService,
    ContactFormStorageConfig,
    ContactFormMediaStorageService,
    ClaimProfileContactFormStorageConfig,
    ClaimProfileContactFormMediaStorageService,
  ],

  exports: [
    // Make sure to export the services
    IMediaService,
    IMediaRepository,
    'S3_MEDIA_STORAGE_SERVICE',
    'LOCAL_MEDIA_STORAGE_SERVICE',
    'MEDIA_DOMAIN_STORAGE_SERVICES',
    BrandStorageConfig,
    BrandMediaStorageService,
    CompanyStorageConfig,
    CompanyMediaStorageService,
    UserStorageConfig,
    UserMediaStorageService,
    LifestyleStorageConfig,
    LifestyleMediaStorageService,
    AmenityStorageConfig,
    AmenityMediaStorageService,
    RankingCategoryStorageConfig,
    RankingCategoryMediaStorageService,
    ResidenceStorageConfig,
    ResidenceMediaStorageService,
    ResidenceUnitStorageConfig,
    ResidenceUnitMediaStorageService,
    CareerContactFormStorageConfig,
    CareerContactFormMediaStorageService,
    ContactFormStorageConfig,
    ContactFormMediaStorageService,
    ClaimProfileContactFormStorageConfig,
    ClaimProfileContactFormMediaStorageService,
  ],
})
export class MediaModule {}
