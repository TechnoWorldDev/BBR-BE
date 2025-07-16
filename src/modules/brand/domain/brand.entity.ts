import { Model } from 'objection';
import { BrandStatus } from './brand-status.enum';
import { Media } from 'src/modules/media/domain/media.entity';
import { BrandType } from 'src/modules/brand_type/domain/brand-type.entity';

export class Brand extends Model {
  id!: string;
  name!: string;
  slug!: string;
  description!: string;
  brandTypeId!: string;
  status!: BrandStatus;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  brandType?: BrandType;
  logo!: Media;

  static tableName = 'brands';

  static relationMappings = {
    brandType: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => BrandType,
      join: {
        from: 'brands.brandTypeId',
        to: 'brand_types.id',
      },
    },
    logo: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Media,
      join: {
        from: 'brands.logoId',
        to: 'media.id',
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

  static async create(data: Partial<Brand>): Promise<Brand> {
    return Brand.query().insert(data).returning('*');
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
