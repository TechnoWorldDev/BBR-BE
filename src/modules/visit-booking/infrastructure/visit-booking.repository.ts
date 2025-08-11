import { Injectable } from '@nestjs/common';
import { VisitBooking } from '../domain/visit-booking.entity';
import { IVisitBookingRepository } from '../domain/visit-booking.repository.interface';

@Injectable()
export class VisitBookingRepository extends IVisitBookingRepository {
  async create(data: Partial<VisitBooking>): Promise<VisitBooking> {
    return await VisitBooking.query().insert(data);
  }

  async findById(id: string): Promise<VisitBooking | null> {
    const result = await VisitBooking.query()
      .findById(id)
      .withGraphFetched('[user, residence]');
    return result || null;
  }

  async findByUserId(userId: string): Promise<VisitBooking[]> {
    return await VisitBooking.query()
      .where('userId', userId)
      .withGraphFetched('[user, residence]')
      .orderBy('createdAt', 'desc');
  }

  async findByResidenceId(residenceId: string): Promise<VisitBooking[]> {
    return await VisitBooking.query()
      .where('residenceId', residenceId)
      .withGraphFetched('[user, residence]')
      .orderBy('createdAt', 'desc');
  }

  async findByPaymentIntentId(paymentIntentId: string): Promise<VisitBooking | null> {
    const result = await VisitBooking.query()
      .where('stripePaymentIntentId', paymentIntentId)
      .withGraphFetched('[user, residence]')
      .first();
    return result || null; 
  }

  async update(id: string, data: Partial<VisitBooking>): Promise<VisitBooking | null> {
    const updated = await VisitBooking.query()
      .patchAndFetchById(id, data)
      .withGraphFetched('[user, residence]');
    return updated || null;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await VisitBooking.query().deleteById(id);
    return deleted > 0;
  }

  async findAll(): Promise<VisitBooking[]> {
    return await VisitBooking.query()
      .withGraphFetched('[user, residence]')
      .orderBy('createdAt', 'desc');
  }

  async findByStatus(status: string): Promise<VisitBooking[]> {
    return await VisitBooking.query()
      .where('status', status)
      .withGraphFetched('[user, residence]')
      .orderBy('createdAt', 'desc');
  }
}
