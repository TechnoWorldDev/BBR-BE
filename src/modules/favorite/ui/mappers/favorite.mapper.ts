import { FavoriteTypeEnum } from 'src/shared/types/favorite-type.enum';
import { Favorite } from '../../domain/favorite.entity';
import { FavoriteResponse } from '../response/favorite.response';
import { ResidenceMapper } from './residence.mapper';
import { UnitMapper } from './unit.mapper';

export class FavoriteMapper {
  static toResponse(favorite: Favorite): FavoriteResponse {
    const mappedEntity = this.mapEntity(favorite.entityType, favorite.entity);

    return new FavoriteResponse(
      favorite.id,
      mappedEntity,
      favorite.entityType,
      favorite.createdAt,
      favorite.updatedAt
    );
  }

  private static mapEntity(type: string, entity: any): any {
    if (!entity) return null;

    switch (type) {
      case FavoriteTypeEnum.RESIDENCES:
        return ResidenceMapper.toPublicResponse(entity);
      case FavoriteTypeEnum.UNITS:
        return UnitMapper.toResponse(entity);
      default:
        return entity; // fallback ako ne postoji mapper
    }
  }
}
