import { Model, RelationMappings } from 'objection';

import { CareerContactFormStatusEnum } from './career-contact-form-status.enum';
import { Media } from '../../../media/domain/media.entity';

export class CareerContactForm extends Model {
  id!: string;
  fullName!: string;
  email!: string;
  phone!: string;
  linkedin: string | null;
  message!: string;
  cv!: Media | null;
  position!: string;
  websiteURL!: string;
  status!: CareerContactFormStatusEnum;
  note: string | null;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'career_contact_forms';


  static relationMappings: RelationMappings = {
    cv: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Media,
      join: {
        from: 'career_contact_forms.cvId',
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
}
