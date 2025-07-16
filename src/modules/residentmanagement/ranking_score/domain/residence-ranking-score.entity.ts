import { Model } from 'objection';
import { Residence } from '../../residence/domain/residence.entity';
import { RankingCategory } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category.entity';
import { RankingCriteria } from 'src/modules/shared/rankingmanagement/criteria/domain/ranking-criteria.entity';

export class ResidenceRankingScore extends Model {
  id!: string;
  residenceId!: string;
  rankingCategoryId!: string;
  rankingCriteriaId!: string;
  score!: number;

  createdAt?: Date;
  updatedAt?: Date;

  criteria?: RankingCriteria;

  static tableName = 'residence_ranking_criteria_scores';

  static relationMappings = {
    residence: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Residence,
      join: {
        from: 'residence_ranking_criteria_scores.residenceId',
        to: 'residences.id',
      },
    },
    // rankingCategory: {
    //   relation: Model.BelongsToOneRelation,
    //   modelClass: () => RankingCategory,
    //   join: {
    //     from: 'residence_ranking_criteria_scores.rankingCategoryId',
    //     to: 'ranking_categories.id',
    //   },
    // },
    criteria: {
      relation: Model.BelongsToOneRelation,
      modelClass: RankingCriteria,
      join: {
        from: 'residence_ranking_criteria_scores.rankingCriteriaId',
        to: 'ranking_criteria.id',
      },
    },
  };
}
