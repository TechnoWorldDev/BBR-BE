import { VerificationTypeEnum } from '../../domain/verification-type.enum';
import { VerificationStatusEnum } from '../../domain/verification-status.enum';
import { PaymentStatusEnum } from '../../domain/payment-status.enum';

export class ResidenceVerificationResponse {
  id: string;
  userId: string;
  residenceId?: string;
  verificationType: VerificationTypeEnum;
  status: VerificationStatusEnum;
  price: number;
  paymentStatus: PaymentStatusEnum;
  notes?: string;
  adminNotes?: string;
  meetingLink?: string;
  platform?: string;
  scheduledDate?: Date;
  scheduledTime?: string;
  preferredDate?: Date;
  preferredTime?: string;
  numberOfVisitors?: number;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  residence?: {
    id: string;
    name: string;
    slug: string;
  };
}
