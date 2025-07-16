import { Model, RelationMappings } from 'objection';
import { UnitStatusEnum } from '../../unit/domain/unit-status.enum';
import { Media } from 'src/modules/media/domain/media.entity';

export class Unit extends Model {
  id!: string;
  name!: string;
  description: string;
  surface: number;
  status: UnitStatusEnum;
  regularPrice: number;
  exclusivePrice: number;
  exclusiveOfferStartDate: Date;
  exclusiveOfferEndDate: Date;
  roomType: string;
  roomAmount: number;
  type: string;
  serviceType: string;
  serviceAmount: number;
  featureImage: Media;


  static tableName = 'units';

  static relationMappings: RelationMappings = {
    featureImage: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Media,
      join: {
        from: 'units.featureImageId',
        to: 'media.id',
      },
    },
  };




}
