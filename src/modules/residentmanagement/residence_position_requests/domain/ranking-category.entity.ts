import { Model } from 'objection';
import { Media } from 'src/modules/media/domain/media.entity';
import { RankingCategoryStatus } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category-status.enum';

export class RankingCategory extends Model {
  id!: string;
  name!: string;
  slug!: string;
  title!: string;
  description!: string;
  residenceLimitation!: number;
  rankingPrice!: number;
  featuredImage!: Media;
  status!: RankingCategoryStatus;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'ranking_categories';
}
