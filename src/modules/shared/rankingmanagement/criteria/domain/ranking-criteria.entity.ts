import { Model } from 'objection';
import { RankingCategoryCriteria } from '../../category/domain/ranking-category-criteria.entity';

export class RankingCriteria extends Model {
  id: string;
  name: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;

  weight?: number;
  isDefault?: boolean;

  static tableName = 'ranking_criteria';

  static relationMappings = {
    categoryWeights: {
      relation: Model.HasManyRelation,
      modelClass: () => RankingCategoryCriteria,
      join: {
        from: 'ranking_criteria.id',
        to: 'ranking_category_criteria.rankingCriteriaId',
      },
    },
  };

  $beforeInsert(): Promise<any> | void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate(): Promise<any> | void {
    this.updatedAt = new Date();
  }
}
