import { Model } from 'objection';
import { RankingHistoryOperationType } from './ranking-history-operation-type.enum';

export class ResidenceTotalScoreHistory extends Model {
  id!: string;
  residenceId!: string;
  rankingCategoryId!: string;
  totalScore!: number;
  position!: number;
  operationType!: RankingHistoryOperationType;
  changedAt!: Date;
  changedBy?: string;

  static tableName = 'residence_total_score_history';

  $beforeInsert() {
    this.changedAt = new Date();
  }
}
