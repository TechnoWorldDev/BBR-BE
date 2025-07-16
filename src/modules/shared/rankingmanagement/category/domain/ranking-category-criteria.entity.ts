import { Model } from 'objection';
import { RankingCriteria } from '../../criteria/domain/ranking-criteria.entity';
import { RankingCategory } from './ranking-category.entity';

export class RankingCategoryCriteria extends Model {
  id!: string;
  rankingCategoryId!: string;
  rankingCriteriaId!: string;
  weight!: number;

  static tableName = 'ranking_category_criteria';

  static relationMappings = {
    rankingCriteria: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => RankingCriteria,
      join: {
        from: 'ranking_category_criteria.rankingCriteriaId',
        to: 'ranking_criteria.id',
      },
    },
    rankingCategory: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => RankingCategory,
      join: {
        from: 'ranking_category_criteria.rankingCategoryId',
        to: 'ranking_categories.id',
      },
    },
  };
}
