import { Injectable } from '@nestjs/common';
import { VerificationPricing } from '../domain/verification-pricing.entity';
import { IVerificationPricingRepository } from '../domain/verification-pricing.repository.interface';

@Injectable()
export class VerificationPricingRepository implements IVerificationPricingRepository {
  async findByType(verificationType: string): Promise<VerificationPricing | null> {
    const pricing = await VerificationPricing.query()
      .where('verificationType', verificationType)
      .where('active', true)
      .first();
    return pricing || null;
  }

  async findAllActive(): Promise<VerificationPricing[]> {
    return await VerificationPricing.query()
      .where('active', true)
      .orderBy('verificationType')
      .select('*'); // Explicitly select all columns for clarity
  }

  async update(id: string, data: Partial<VerificationPricing>): Promise<VerificationPricing> {
    const pricing = await VerificationPricing.query()
      .patchAndFetchById(id, data);
    
    if (!pricing) {
      throw new Error(`VerificationPricing with id ${id} not found`);
    }
    
    return pricing;
  }
}
