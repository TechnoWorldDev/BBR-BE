import { Model, RelationMappings } from 'objection';
import { Brand } from 'src/modules/brand/domain/brand.entity';
import { Company } from 'src/modules/company/domain/company.entity';
import { Media } from 'src/modules/media/domain/media.entity';
import { Amenity } from 'src/modules/residentmanagement/amenity/domain/amenity.entity';
import { KeyFeature } from 'src/modules/residentmanagement/key_feature/domain/key-feature.entity';
import { RankingCategory } from 'src/modules/residentmanagement/residence/domain/ranking-category.entity';
import { ResidenceHighlightedAmenity } from 'src/modules/residentmanagement/residence/domain/residence-highlighted-amenities.entity';
import { ResidenceStatusEnum } from 'src/modules/residentmanagement/residence/domain/residence-status.enum';
import { ResidenceTotalScore } from 'src/modules/residentmanagement/residence/domain/residence-total-score.entity';
import { Unit } from 'src/modules/residentmanagement/residence/domain/unit.entity';
import { City } from 'src/modules/shared/city/domain/city.entity';
import { Country } from 'src/modules/shared/country/domain/country.entity';
import { DevelopmentStatusEnum } from 'src/shared/types/development-status.enum';
import { RentalPotentialEnum } from 'src/shared/types/rental-potential.enum';

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
  companyId!: string;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;

  featuredImage?: Media;

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
    totalScores: {
      relation: Model.HasManyRelation,
      modelClass: () => ResidenceTotalScore,
      join: {
        from: 'residences.id',
        to: 'residence_total_scores.residenceId',
      },
    },
  };
}
