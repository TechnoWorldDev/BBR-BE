import { Model, RelationMappings } from 'objection';
import { Media } from 'src/modules/media/domain/media.entity';

export class Company extends Model {
  id: string;
  name: string;
  address?: string;
  image?: Media;
  phoneNumber?: string;
  phoneNumberCountryCode?: string;
  website?: string;
  contactPersonAvatar?: Media;
  contactPersonFullName?: string;
  contactPersonJobTitle?: string;
  contactPersonEmail?: string;
  contactPersonPhoneNumber?: string;
  contactPersonPhoneNumberCountryCode?: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'companies';

  static relationMappings: RelationMappings = {
    image: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'companies.imageId',
        to: 'media.id',
      },
    },
    contactPersonAvatar: {
      relation: Model.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'companies.contactPersonAvatarId',
        to: 'media.id',
      },
    },
  };
}
