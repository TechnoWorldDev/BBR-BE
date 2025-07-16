import { Module } from '@nestjs/common';
import { CreateAmenityCommandHandler } from './application/handler/create-amenity.command.handler';
import { FetchAmenitiesCommandQuery } from './application/query/fetch-amenities.command.query';
import { UpdateAmenityCommandHandler } from './application/handler/update-amenity.command.handler';
import { DeleteAmenityCommandHandler } from './application/handler/delete-amenity.command.handler';
import { AmenityController } from './ui/amenity.controller';
import { AmenityRepositoryImpl } from './infrastructure/amenity.repository';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { IAmenityRepository } from './domain/amenity.repository.interface';
import { MediaModule } from '../../media/media.module';
import { FindAmenityByIdCommandQuery } from './application/query/find-amenity-by-id.command.query';
import { AmenityMapper } from './ui/mapper/amenity.ui.mapper';

@Module({
  imports: [DatabaseModule, MediaModule],
  controllers: [AmenityController],
  providers: [
    {
      provide: IAmenityRepository,
      useClass: AmenityRepositoryImpl,
    },
    CreateAmenityCommandHandler,
    FindAmenityByIdCommandQuery,
    FetchAmenitiesCommandQuery,
    UpdateAmenityCommandHandler,
    DeleteAmenityCommandHandler,
    AmenityMapper,
  ],
})
export class AmenityModule {}
