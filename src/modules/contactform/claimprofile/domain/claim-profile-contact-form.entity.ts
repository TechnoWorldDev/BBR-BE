import { Model } from 'objection';
import { Media } from 'src/modules/media/domain/media.entity';
import { PhoneCode } from 'src/modules/shared/phone_code/domain/phone-code.entity';
import { ClaimProfileContactFormStatus } from './claim-profile-contact-form-status.enum';
import { Residence } from './residence.entity';
import { User } from 'src/modules/user/domain/user.entity';

export class ClaimProfileContactForm extends Model {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneCodeId!: string;
  phoneNumber!: string;
  websiteUrl!: string;
  cvId?: string;
  status!: ClaimProfileContactFormStatus;
  residenceId!: string;
  userId!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  residence: Residence;
  createdBy: any;

  phoneCode: PhoneCode;
  cv: Media;

  static tableName = 'claim_profile_contact_forms';

  static relationMappings = {
    phoneCode: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => PhoneCode,
      join: {
        from: 'claim_profile_contact_forms.phoneCodeId',
        to: 'phone_codes.id',
      },
    },
    cv: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Media,
      join: {
        from: 'claim_profile_contact_forms.cvId',
        to: 'media.id',
      },
    },
    residence: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Residence,
      join: {
        from: 'claim_profile_contact_forms.residenceId',
        to: 'residences.id',
      },
    },
    createdBy: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => User,
      join: {
        from: 'claim_profile_contact_forms.userId',
        to: 'users.id',
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
}
