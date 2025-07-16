import { Model, RelationMappings, QueryBuilder } from 'objection';
import { Brand } from 'src/modules/brand/domain/brand.entity';
import { Company } from 'src/modules/company/domain/company.entity';
import { Media } from 'src/modules/media/domain/media.entity';
import { City } from 'src/modules/shared/city/domain/city.entity';
import { Country } from 'src/modules/shared/country/domain/country.entity';
import { DevelopmentStatusEnum } from 'src/shared/types/development-status.enum';
import { RentalPotentialEnum } from 'src/shared/types/rental-potential.enum';
import { Amenity } from '../../amenity/domain/amenity.entity';
import { KeyFeature } from '../../key_feature/domain/key-feature.entity';
import { ResidenceStatusEnum } from './residence-status.enum';
import { Unit } from './unit.entity';
import { ResidenceRankingScore } from '../../ranking_score/domain/residence-ranking-score.entity';
import { ResidenceHighlightedAmenity } from './residence-highlighted-amenities.entity';
import { ResidenceTotalScore } from '../../ranking_score/domain/residence-total-score.entity';
import { RankingCategory } from './ranking-category.entity';

export class Residence extends Model {
  id!: string;
  name!: string;
  slug!: string;
  status!: ResidenceStatusEnum;
  developmentStatus!: DevelopmentStatusEnum;
  subtitle!: string;
  description!: string;
  budgetStartRange!: number;
  budgetEndRange!: number;
  address!: string;
  longitude!: string;
  latitude!: string;
  websiteUrl?: string;
  yearBuilt!: string;
  floorSqft!: number;
  staffRatio!: number;
  avgPricePerUnit?: number;
  avgPricePerSqft?: number;
  rentalPotential?: RentalPotentialEnum;
  petFriendly!: boolean;
  disabledFriendly!: boolean;
  videoTourUrl?: string;
  units: Unit[];

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;

  featuredImage?: Media;
  keyFeatures?: KeyFeature[];
  countryId!: string;
  country!: Country;
  cityId!: string;
  city!: City;
  brandId!: string;
  brand?: Brand;
  videoTour?: Media;
  amenities?: Amenity[];
  company?: Company;

  mainGallery?: Media[];
  secondaryGallery?: Media[];
  rankingCategories?: RankingCategory[];
  highlightedAmenities?: ResidenceHighlightedAmenity[];

  rankingScores?: ResidenceRankingScore[];
  totalScores?: ResidenceTotalScore[];
  companyId?: string;

  static tableName = 'residences';

  static relationMappings: RelationMappings = {
    keyFeatures: {
      relation: Model.ManyToManyRelation,
      modelClass: () => KeyFeature,
      join: {
        from: 'residences.id',
        through: {
          from: 'residence_key_feature_relations.residence_id',
          to: 'residence_key_feature_relations.key_feature_id',
        },
        to: 'key_features.id',
      },
    },
    featuredImage: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Media,
      join: {
        from: 'residences.featuredImageId',
        to: 'media.id',
      },
    },
    brand: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Brand,
      join: {
        from: 'residences.brandId',
        to: 'brands.id',
      },
    },
    country: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Country,
      join: {
        from: 'residences.countryId',
        to: 'countries.id',
      },
    },
    city: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => City,
      join: {
        from: 'residences.cityId',
        to: 'cities.id',
      },
    },
    videoTour: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'residences.videoTourId',
        to: 'media.id',
      },
    },
    amenities: {
      relation: Model.ManyToManyRelation,
      modelClass: () => Amenity,
      join: {
        from: 'residences.id',
        through: {
          from: 'residence_amenity_relations.residence_id',
          to: 'residence_amenity_relations.amenity_id',
        },
        to: 'amenities.id',
      },
    },
    company: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Company,
      join: {
        from: 'residences.companyId',
        to: 'companies.id',
      },
    },
    mainGallery: {
      relation: Model.ManyToManyRelation,
      modelClass: Media,
      join: {
        from: 'residences.id',
        through: {
          from: 'residence_media.residence_id',
          to: 'residence_media.media_id',
          extra: ['media_type', 'order'],
          filter: (builder) => builder.where('media_type', 'mainGallery'),
        },
        to: 'media.id',
      },
    },
    secondaryGallery: {
      relation: Model.ManyToManyRelation,
      modelClass: Media,
      join: {
        from: 'residences.id',
        through: {
          from: 'residence_media.residence_id',
          to: 'residence_media.media_id',
          extra: ['media_type', 'order'],
          filter: (builder) => builder.where('media_type', 'secondaryGallery'),
        },
        to: 'media.id',
      },
    },
    units: {
      relation: Model.HasManyRelation,
      modelClass: () => Unit,
      join: {
        from: 'residences.id',
        to: 'units.residenceId',
      },
    },
    highlightedAmenities: {
      relation: Model.HasManyRelation,
      modelClass: ResidenceHighlightedAmenity,
      join: {
        from: 'residences.id',
        to: 'residence_highlighted_amenities.residenceId',
      },
    },
    rankingCategories: {
      relation: Model.ManyToManyRelation,
      modelClass: () => RankingCategory,
      join: {
        from: 'residences.id',
        through: {
          from: 'residence_ranking_categories.residenceId',
          to: 'residence_ranking_categories.rankingCategoryId',
        },
        to: 'ranking_categories.id',
      },
    },
    rankingScores: {
      relation: Model.HasManyRelation,
      modelClass: () => ResidenceRankingScore,
      join: {
        from: 'residences.id',
        to: 'residence_ranking_criteria_scores.residenceId',
      },
    },
    totalScores: {
      relation: Model.HasManyRelation,
      modelClass: () => ResidenceTotalScore,
      join: {
        from: 'residences.id',
        to: 'residence_total_scores.residenceId',
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

  static async create(data: Partial<Residence>): Promise<Residence> {
    return await Residence.query().insertAndFetch(data).returning('*');
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
