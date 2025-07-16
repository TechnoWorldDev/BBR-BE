import { Model, RelationMappings } from 'objection';
import { Media } from 'src/modules/media/domain/media.entity';
import { UnitStatusEnum } from 'src/modules/residentmanagement/unit/domain/unit-status.enum';
import { UnitTransactionTypeEnum } from 'src/modules/residentmanagement/unit/domain/unit-transaction-type.enum';
import { UnitType } from 'src/modules/residentmanagement/unit_type/domain/unit_type.entity';

export class Unit extends Model {
  id!: string;
  name!: string;
  slug!: string;
  description: string;
  about: string;
  bathrooms: string;
  bedroom: string;
  floor: string;
  transactionType: UnitTransactionTypeEnum;
  characteristics: string[];
  surface: number;
  status: UnitStatusEnum;
  regularPrice: number;
  exclusivePrice: number;
  exclusiveOfferStartDate: Date;
  exclusiveOfferEndDate: Date;
  roomType: string;
  roomAmount: number;
  unitTypeId!: string;
  unitType: UnitType;
  serviceType: string;
  serviceAmount: number;
  featureImage: Media;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'units';

  static relationMappings: RelationMappings = {
    unitType: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => UnitType,
      join: {
        from: 'units.unitTypeId',
        to: 'unit_types.id',
      },
    },
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
