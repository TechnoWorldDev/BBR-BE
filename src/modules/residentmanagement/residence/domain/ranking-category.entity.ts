import { Model } from 'objection';
import { Residence } from 'src/modules/residentmanagement/residence/domain/residence.entity';
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

  rankingCategoryTypeId!: string;

  static tableName = 'ranking_categories';

  static relationMappings = {
    featuredImage: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'ranking_categories.featuredImageId',
        to: 'media.id',
      },
    },
    residences: {
      relation: Model.ManyToManyRelation,
      modelClass: () => Residence,
      join: {
        from: 'ranking_categories.id',
        through: {
          from: 'residence_ranking_categories.ranking_category_id',
          to: 'residence_ranking_categories.residence_id',
        },
        to: 'residences.id',
      },
    },
  };
}
