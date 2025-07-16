import { Model, RelationMappings } from 'objection';
import { Media } from '../../../media/domain/media.entity';
import { Residence } from './residence.entity';
import { UnitStatusEnum } from './unit-status.enum';
import { UnitType } from '../../unit_type/domain/unit_type.entity';
import { UnitTransactionTypeEnum } from './unit-transaction-type.enum';

export class Unit extends Model {
  id!: string;
  name!: string;
  slug!: string;
  description: string;
  about: string;
  bathrooms: string;
  bedroom: string;
  floor: string;
  transactionType: UnitTransactionTypeEnum;
  characteristics: string[];
  surface: number;
  status: UnitStatusEnum;
  regularPrice: number;
  exclusivePrice: number;
  exclusiveOfferStartDate: Date;
  exclusiveOfferEndDate: Date;
  roomType: string;
  roomAmount: number;
  unitTypeId!: string;
  unitType: UnitType;
  serviceType: string;
  serviceAmount: number;
  services: any;
  gallery: Media[];
  featureImage: Media;
  residence: Residence;
  residenceId: string;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'units';

  static relationMappings: RelationMappings = {
    residence: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Residence,
      join: {
        from: 'units.residenceId',
        to: 'residences.id',
      },
    },
    unitType: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => UnitType,
      join: {
        from: 'units.unitTypeId',
        to: 'unit_types.id',
      },
    },
    gallery: {
      relation: Model.ManyToManyRelation,
      modelClass: () => Media,
      join: {
        from: 'units.id',
        through: {
          from: 'unit_gallery.unitId',
          to: 'unit_gallery.mediaId',
        },
        to: 'media.id',
      },
    },
    featureImage: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Media,
      join: {
        from: 'units.featureImageId',
        to: 'media.id',
      },
    },
  };

  async $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  async $beforeUpdate() {
    this.updatedAt = new Date();
  }

  getAllImages(): Media[] {
    const gallery = this.gallery;
    const feature = [this.featureImage];

    return [...gallery, ...feature];
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
