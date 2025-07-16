import { Model, RelationMappings } from 'objection';
import { Media } from 'src/modules/media/domain/media.entity';
import { ResidenceStatusEnum } from 'src/modules/residentmanagement/residence/domain/residence-status.enum';
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

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;

  featuredImage?: Media;

  static tableName = 'residences';

  static relationMappings: RelationMappings = {
    featuredImage: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Media,
      join: {
        from: 'residences.featuredImageId',
        to: 'media.id',
      },
    },
  };
}
