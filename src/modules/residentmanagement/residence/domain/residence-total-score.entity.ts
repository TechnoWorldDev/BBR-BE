import { Model, RelationMappings } from 'objection';
import { RankingCategory } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category.entity';
import { Residence } from '../../residence/domain/residence.entity';

export class ResidenceTotalScore extends Model {
  id!: string;
  residenceId!: string;
  rankingCategoryId!: string;
  totalScore!: number;
  position!: number;
  createdAt?: Date;
  updatedAt?: Date;

  rankingCategory?: RankingCategory;
  residence?: Residence;

  static tableName = 'residence_total_scores';

  static relationMappings: RelationMappings = {
    residence: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Residence,
      join: {
        from: 'residence_total_scores.residenceId',
        to: 'residences.id',
      },
    },
    rankingCategory: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => RankingCategory,
      join: {
        from: 'residence_total_scores.rankingCategoryId',
        to: 'ranking_categories.id',
      },
    },
  };
}
