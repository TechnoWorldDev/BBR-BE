import { Model } from 'objection';
import { Residence } from './residence.entity';
import { Media } from 'src/modules/media/domain/media.entity';
import { Amenity } from '../../amenity/domain/amenity.entity';

export class ResidenceHighlightedAmenity extends Model {
  id: string;
  residenceId!: string;
  amenityId!: string;
  order?: number;

  amenity?: Amenity;

  static tableName = 'residence_highlighted_amenities';

  static relationMappings = {
    residence: {
      relation: Model.BelongsToOneRelation,
      modelClass: Residence,
      join: {
        from: 'residence_highlighted_amenities.residenceId',
        to: 'residences.id',
      },
    },
    amenity: {
      relation: Model.BelongsToOneRelation,
      modelClass: Amenity,
      join: {
        from: 'residence_highlighted_amenities.amenityId',
        to: 'amenities.id',
      },
    },
    featuredImage: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'residence_highlighted_amenities.featuredImageId',
        to: 'media.id',
      },
    },
  };
}
