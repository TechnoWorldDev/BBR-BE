import { Model } from 'objection';
import { Residence } from '../../residence/domain/residence.entity';

export class KeyFeature extends Model {
  id!: string;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static tableName = 'key_features';

  static relationMappings = {
    residences: {
      relation: Model.ManyToManyRelation,
      modelClass: () => Residence,
      join: {
        from: 'residence_key_features.id',
        through: {
          from: 'residence_key_feature_relations.key_feature_id',
          to: 'residence_key_feature_relations.residence_id',
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

  static async create(data: Partial<KeyFeature>): Promise<KeyFeature> {
    return KeyFeature.query().insert(data).returning('*');
  }
}
