import { Model, RelationMappings } from 'objection';
import { User } from './user.entity';
import { Residence } from './residence.entity';
import { RankingCategory } from './ranking-category.entity';
import { ResidencePositionRequestStatusEnum } from 'src/shared/types/residence-position-requests.enum';

export class ResidencePositionRequest extends Model {
  id!: string;
  residenceId!: string;
  rankingCategoryId!: string;
  requestedPosition?: number;
  requestedBy!: string;
  requestedAt!: Date;
  status!: ResidencePositionRequestStatusEnum;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  createdAt!: Date;
  updatedAt!: Date;

  residence?: Residence;
  rankingCategory?: RankingCategory;
  requestedByUser?: User;
  reviewedByUser?: User;

  static tableName = 'residence_position_requests';

  static relationMappings: RelationMappings = {
    residence: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Residence,
      join: {
        from: 'residence_position_requests.residenceId',
        to: 'residences.id',
      },
    },
    rankingCategory: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => RankingCategory,
      join: {
        from: 'residence_position_requests.rankingCategoryId',
        to: 'ranking_categories.id',
      },
    },
    requestedByUser: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => User,
      join: {
        from: 'residence_position_requests.requestedBy',
        to: 'users.id',
      },
    },
    reviewedByUser: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => User,
      join: {
        from: 'residence_position_requests.reviewedBy',
        to: 'users.id',
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
