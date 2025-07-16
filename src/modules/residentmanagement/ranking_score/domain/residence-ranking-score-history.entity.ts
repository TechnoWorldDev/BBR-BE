import { Model } from 'objection';
import { RankingHistoryOperationType } from './ranking-history-operation-type.enum';

export class ResidenceRankingScoreHistory extends Model {
  id!: string;
  residenceId!: string;
  rankingCriteriaId!: string;
  score!: number;
  operationType!: RankingHistoryOperationType;
  changedAt!: Date;
  changedBy?: string;

  static tableName = 'residence_ranking_score_history';

  $beforeInsert() {
    this.changedAt = new Date();
  }
}
