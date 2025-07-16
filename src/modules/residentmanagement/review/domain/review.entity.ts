import { Model, RelationMappings } from 'objection';
import { ReviewStatusEnum } from './review-status.enum';
import { UnitType } from './unit_type.entity';
import { Residence } from './residence.entity';
import { User } from './user.entity';

export class Review extends Model {
  id!: string;
  residence!: Residence;
  user!: User;
  dateOfPurchase!: Date;
  unitType!: UnitType;
  isPrimaryResidence!: boolean;
  verifiedOwnerOrTenant!: boolean;

  buildQuality!: number;
  purchaseExperienceRating!: number;
  amenities!: number;
  neighbourhoodLocation!: number;
  valueForMoney!: number;
  serviceQuality!: number;

  additionalFeedback!: string | null;

  status!: ReviewStatusEnum;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  residenceId!:string;
  userId!:string;
  unitTypeId!:string;

  static tableName = 'reviews';

  static relationMappings: RelationMappings = {
    residence: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Residence,
      join: {
        from: 'reviews.residenceId',
        to: 'residences.id',
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => User,
      join: {
        from: 'reviews.userId',
        to: 'users.id',
      },
    },
    unitType: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => UnitType,
      join: {
        from: 'reviews.unitTypeId',
        to: 'unit_types.id',
      },
    },
  };

  async $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  async $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
