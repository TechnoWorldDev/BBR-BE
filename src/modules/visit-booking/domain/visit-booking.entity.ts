import { Model, RelationMappings } from 'objection';
import { VisitTypeEnum } from './visit-type.enum';
import { VisitStatusEnum } from './visit-status.enum';
import { User } from '../../user/domain/user.entity';
import { Residence } from '../../residentmanagement/residence/domain/residence.entity';

export class VisitBooking extends Model {
  id!: string;
  userId!: string;
  residenceId!: string;
  visitType!: VisitTypeEnum;
  status!: VisitStatusEnum;
  scheduledDate?: Date;
  scheduledTime?: string;
  duration?: number; // in minutes
  specialRequirements?: string;
  notes?: string;
  
  // Payment related fields
  amount!: number;
  currency!: string;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  paymentStatus!: string;
  
  // Contact information
  contactName!: string;
  contactEmail!: string;
  contactPhone?: string;
  
  // Virtual visit specific fields
  meetingLink?: string;
  platform?: string; // zoom, teams, etc.
  
  // Site visit specific fields
  address?: string;
  numberOfVisitors?: number;
  
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  // Relations
  user?: User;
  residence?: Residence;

  static tableName = 'visit_bookings';

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => User,
      join: {
        from: 'visit_bookings.userId',
        to: 'users.id',
      },
    },
    residence: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Residence,
      join: {
        from: 'visit_bookings.residenceId',
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

