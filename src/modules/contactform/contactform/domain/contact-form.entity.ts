import { Model, RelationMappings } from 'objection';
import { Media } from '../../../media/domain/media.entity';
import { ContactFormType } from './contact-form-type.enum';

export class ContactForm extends Model {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  link!: string;
  description!: string;
  attachment!: Media | null;
  type!: ContactFormType;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'contact_forms';

  static relationMappings: RelationMappings = {
    attachment: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Media,
      join: {
        from: 'contact_forms.attachmentId',
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
