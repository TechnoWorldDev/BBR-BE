import { Model, RelationMappings } from 'objection';
import { VerificationTypeEnum } from './verification-type.enum';
import { VerificationStatusEnum } from './verification-status.enum';
import { PaymentStatusEnum } from './payment-status.enum';
import { User } from '../../user/domain/user.entity';
import { Residence } from '../../residentmanagement/residence/domain/residence.entity';

export class ResidenceVerification extends Model {
  id!: string;
  userId!: string;
  residenceId?: string;
  
  // Verification details
  verificationType!: VerificationTypeEnum;
  status!: VerificationStatusEnum;
  price!: number;
  paymentStatus!: PaymentStatusEnum;
  
  // Additional information
  notes?: string;
  adminNotes?: string;
  
  // Virtual verification specific fields
  meetingLink?: string;
  platform?: string; // zoom, teams, etc.
  scheduledDate?: Date;
  scheduledTime?: string;
  
  // Physical verification specific fields
  preferredDate?: Date;
  preferredTime?: string;
  numberOfVisitors?: number;
  
  // Payment related fields
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  // Relations
  user?: User;
  residence?: Residence;

  static tableName = 'residence_verifications';

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => User,
      join: {
        from: 'residence_verifications.userId',
        to: 'users.id',
      },
    },
    residence: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Residence,
      join: {
        from: 'residence_verifications.residenceId',
        to: 'residences.id',
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
