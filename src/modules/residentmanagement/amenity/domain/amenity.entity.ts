import { Model } from 'objection';
import { Media } from '../../../media/domain/media.entity';

export class Amenity extends Model {
  id!: string;
  name!: string;
  description!: string;
  featuredImageId?: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  icon!: Media;
  featuredImage?: Media;

  static tableName = 'amenities';

  static relationMappings = {
    icon: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'amenities.iconId',
        to: 'media.id',
      },
    },
    featuredImage: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'amenities.featuredImageId',
        to: 'media.id',
      },
    },
  };

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
