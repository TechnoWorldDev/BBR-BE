import { IsEnum, IsNotEmpty } from 'class-validator';
import { RankingCategoryStatus } from '../../domain/ranking-category-status.enum';

export class UpdateRankingCategoryStatusRequest {
  @IsNotEmpty()
  @IsEnum(RankingCategoryStatus)
  status: RankingCategoryStatus;
}
