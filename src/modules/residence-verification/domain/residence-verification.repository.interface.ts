import { ResidenceVerification } from './residence-verification.entity';

export interface IResidenceVerificationRepository {
  create(data: Partial<ResidenceVerification>): Promise<ResidenceVerification>;
  findById(id: string): Promise<ResidenceVerification | null>;
  findByUserId(userId: string): Promise<ResidenceVerification[]>;
  findByStripePaymentIntentId(paymentIntentId: string): Promise<ResidenceVerification | null>;
  update(id: string, data: Partial<ResidenceVerification>): Promise<ResidenceVerification>;
  delete(id: string): Promise<void>;
}
