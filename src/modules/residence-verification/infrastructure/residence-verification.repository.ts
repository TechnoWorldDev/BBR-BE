import { Injectable } from '@nestjs/common';
import { ResidenceVerification } from '../domain/residence-verification.entity';
import { IResidenceVerificationRepository } from '../domain/residence-verification.repository.interface';

@Injectable()
export class ResidenceVerificationRepository implements IResidenceVerificationRepository {
  async create(data: Partial<ResidenceVerification>): Promise<ResidenceVerification> {
    return await ResidenceVerification.query().insert(data).returning('*');
  }

  async findById(id: string): Promise<ResidenceVerification | null> {
    const verification = await ResidenceVerification.query()
      .findById(id)
      .withGraphFetched('[user, residence]');
    return verification || null;
  }

  async findByUserId(userId: string): Promise<ResidenceVerification[]> {
    return await ResidenceVerification.query()
      .where('userId', userId)
      .withGraphFetched('[user, residence]')
      .orderBy('createdAt', 'desc');
  }

  async findByStripePaymentIntentId(paymentIntentId: string): Promise<ResidenceVerification | null> {
    const verification = await ResidenceVerification.query()
      .where('stripePaymentIntentId', paymentIntentId)
      .withGraphFetched('[user, residence]')
      .first();
    return verification || null;
  }

  async update(id: string, data: Partial<ResidenceVerification>): Promise<ResidenceVerification> {
    const verification = await ResidenceVerification.query()
      .patchAndFetchById(id, data)
      .withGraphFetched('[user, residence]');
    
    if (!verification) {
      throw new Error(`ResidenceVerification with id ${id} not found`);
    }
    
    return verification;
  }

  async delete(id: string): Promise<void> {
    await ResidenceVerification.query().deleteById(id);
  }
}
