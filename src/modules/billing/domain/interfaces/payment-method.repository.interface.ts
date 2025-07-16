import { BillingPaymentMethod } from '../billing-payment-method.entity';

export abstract class IPaymentMethodRepository {
  abstract create(
    paymentMethod: Partial<BillingPaymentMethod>
  ): Promise<BillingPaymentMethod | undefined>;
  abstract setDefault(userId: string, methodId: string): Promise<void>;
  abstract delete(paymentMethodId: string): Promise<void>;
  abstract findAllByUser(userId: string): Promise<BillingPaymentMethod[]>;
}
