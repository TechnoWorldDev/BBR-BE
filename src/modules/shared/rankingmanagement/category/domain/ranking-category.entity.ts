import { Model } from 'objection';
import { RankingCategoryStatus } from './ranking-category-status.enum';
import { RankingCategoryType } from '../../categorytype/domain/ranking-category-type.entity';
import { Media } from '../../../../media/domain/media.entity';
import { Residence } from 'src/modules/residentmanagement/residence/domain/residence.entity';
import { RankingCategoryCriteria } from './ranking-category-criteria.entity';
import { RankingCriteria } from '../../criteria/domain/ranking-criteria.entity';
import { TotalScoreHistoryResponse } from '../ui/response/total-score-history.response';

export class RankingCategory extends Model {
  id!: string;
  name!: string;
  slug!: string;
  title!: string;
  description!: string;
  rankingCategoryType!: RankingCategoryType;
  entityId: string;
  residenceLimitation!: number;
  rankingPrice!: number;
  stripePriceId?: string;
  featuredImage!: Media;
  featuredImageId!: string;
  status!: RankingCategoryStatus;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  rankingCategoryTypeId!: string;
  rankingCriteria?: RankingCriteria[];
  entity: any;
  hasRequest?: any;
  previousPosition?: number;
  previousTotalScore?: number;

  static tableName = 'ranking_categories';

  static relationMappings = {
    rankingCategoryType: {
      relation: Model.BelongsToOneRelation,
      modelClass: RankingCategoryType,
      join: {
        from: 'ranking_categories.rankingCategoryTypeId',
        to: 'ranking_category_types.id',
      },
    },
    featuredImage: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'ranking_categories.featuredImageId',
        to: 'media.id',
      },
    },
    rankingCriteria: {
      relation: Model.ManyToManyRelation,
      modelClass: () => RankingCriteria,
      join: {
        from: 'ranking_categories.id',
        through: {
          from: 'ranking_category_criteria.rankingCategoryId',
          to: 'ranking_category_criteria.rankingCriteriaId',
          extra: ['weight', 'createdAt', 'updatedAt'],
        },
        to: 'ranking_criteria.id',
      },
    },
    // residences: {
    //   relation: Model.ManyToManyRelation,
    //   modelClass: () => Residence,
    //   join: {
    //     from: 'ranking_categories.id',
    //     through: {
    //       from: 'residence_ranking_categories.rankingCategoryId',
    //       to: 'residence_ranking_categories.residenceId',
    //     },
    //     to: 'residences.id',
    //   },
    // },
    residences: {
      relation: Model.ManyToManyRelation,
      modelClass: () => Residence,
      join: {
        from: 'ranking_categories.id',
        through: {
          from: 'residence_total_scores.rankingCategoryId',
          to: 'residence_total_scores.residenceId',
          extra: ['total_score', 'position'],
        },
        to: 'residences.id',
      },
    },
  };

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static slugify(input: string): string {
    return input
      .toLowerCase()
      .normalize('NFD') // uklanja dijakritike (č, ć, š, ž...)
      .replace(/[\u0300-\u036f]/g, '') // dodatni korak da se uklone svi akcenti
      .replace(/[^a-z0-9]+/g, '-') // sve što nije alfanumeričko pretvori u "-"
      .replace(/^-+|-+$/g, '') // ukloni višak '-' sa početka i kraja
      .replace(/-{2,}/g, '-'); // zameni višestruke '-' jednim
  }
}
