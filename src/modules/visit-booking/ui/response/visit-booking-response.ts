import { VisitTypeEnum } from '../../domain/visit-type.enum';
import { VisitStatusEnum } from '../../domain/visit-status.enum';

export class VisitBookingResponse {
  constructor(
    public readonly user: {
      id: string;
      email: string;
      fullName: string;
      status: string;
      emailVerified: boolean;
    },
    public readonly booking: {
      id: string;
      visitType: VisitTypeEnum;
      status: VisitStatusEnum;
      amount: number;
      currency: string;
      scheduledDate?: Date;
      scheduledTime?: string;
      duration?: number;
      specialRequirements?: string;
      notes?: string;
      numberOfVisitors?: number;
      address?: string;
      platform?: string;
    },
    public readonly checkoutSession: {
      id: string;
      url: string;
      paymentStatus: string;
    },
    public readonly passwordResetEmailSent: boolean,
    public readonly isNewUser: boolean,
    public readonly isNewResidence: boolean,
    public readonly residence?: {
      id: string;
      name: string;
      slug: string;
      status: string;
      developmentStatus: string;
    }
  ) {}
}
