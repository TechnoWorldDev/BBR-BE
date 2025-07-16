import { Model } from 'objection';
import { Brand } from 'src/modules/brand/domain/brand.entity';

export class BrandType extends Model {
  id!: string;
  name!: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;
  brands?: Brand[];

  static tableName = 'brand_types';

  static relationMappings = {
    brands: {
      relation: Model.HasManyRelation,
      modelClass: () => Brand,
      join: {
        from: 'brand_types.id',
        to: 'brands.brandTypeId',
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

  static async create(data: Partial<BrandType>): Promise<BrandType> {
    return await BrandType.query().insert(data).returning('*');
  }
}
