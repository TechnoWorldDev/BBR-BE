import { VerificationPricing } from './verification-pricing.entity';

export interface IVerificationPricingRepository {
  findByType(verificationType: string): Promise<VerificationPricing | null>;
  findAllActive(): Promise<VerificationPricing[]>;
  update(id: string, data: Partial<VerificationPricing>): Promise<VerificationPricing>;
}
