import { VisitBooking } from './visit-booking.entity';

export abstract class IVisitBookingRepository {
  abstract create(data: Partial<VisitBooking>): Promise<VisitBooking>;
  abstract findById(id: string): Promise<VisitBooking | null>;
  abstract findByUserId(userId: string): Promise<VisitBooking[]>;
  abstract findByResidenceId(residenceId: string): Promise<VisitBooking[]>;
  abstract findByPaymentIntentId(paymentIntentId: string): Promise<VisitBooking | null>;
  abstract update(id: string, data: Partial<VisitBooking>): Promise<VisitBooking | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract findAll(): Promise<VisitBooking[]>;
  abstract findByStatus(status: string): Promise<VisitBooking[]>;
}
