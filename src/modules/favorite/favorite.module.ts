import { Module } from '@nestjs/common';
import { FavoriteController } from './ui/favorite.controller';
import { IFavoriteRepository } from './domain/favorite.repository.interface';
import { FavoriteRepositoryImpl } from './intrastructure/favorite.repository';
import { FetchAllFavoritesQueryHandler } from './application/query/fetch-all-favorites.query.handler';
import { AddFavoriteCommandHandler } from './application/handlers/add-favorite.command.handler';
import { IResidenceRepository } from './domain/residence.repository.interface';
import { IUnitRepository } from './domain/unit.repository.interface';
import { UnitRepositoryImpl } from './intrastructure/unit.repository';
import { ResidenceRepositoryImpl } from './intrastructure/residence.repository';
import { RemoveFavoriteCommandHandler } from './application/handlers/remove-favorite.command.handler';

@Module({
  imports: [],
  controllers: [FavoriteController],
  providers: [
    {
      provide: IFavoriteRepository,
      useClass: FavoriteRepositoryImpl,
    },
    {
      provide: IResidenceRepository,
      useClass: ResidenceRepositoryImpl,
    },
    {
      provide: IUnitRepository,
      useClass: UnitRepositoryImpl,
    },
    FetchAllFavoritesQueryHandler,
    AddFavoriteCommandHandler,
    RemoveFavoriteCommandHandler,
  ],
  exports: [],
})
export class FavoriteModule {}
