import { Injectable } from '@nestjs/common';
import { BillingPaymentMethod } from '../domain/billing-payment-method.entity';
import { IPaymentMethodRepository } from '../domain/interfaces/payment-method.repository.interface';

@Injectable()
export class PaymentMethodRepositoryImpl implements IPaymentMethodRepository {
  async create(
    paymentMethod: Partial<BillingPaymentMethod>
  ): Promise<BillingPaymentMethod | undefined> {
    return await BillingPaymentMethod.query().insert({
      ...paymentMethod,
    });
  }

  async setDefault(userId: string, methodId: string): Promise<void> {
    await BillingPaymentMethod.query().where('user_id', userId).update({ isDefault: false });

    await BillingPaymentMethod.query()
      .where('user_id', userId)
      .andWhere('stripe_payment_method_id', methodId)
      .update({ isDefault: true, updatedAt: new Date() });
  }

  async delete(methodId: string): Promise<void> {
    await BillingPaymentMethod.query().where('stripe_payment_method_id', methodId).delete();
  }

  async findAllByUser(userId: string): Promise<any[]> {
    return await BillingPaymentMethod.query().where('user_id', userId);
  }
}
