import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IPaymentMethodRepository } from '../../domain/interfaces/payment-method.repository.interface';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { StripeCustomerService } from '../services/stripe-customer.service';
import { AddPaymentMethodCommand } from '../commands/add-payment-method.command';
import { IUserRepository } from 'src/modules/user/domain/user.repository.interface';

@Injectable()
export class AddPaymentMethodCommandHandler {
  constructor(
    private readonly paymentMethodRepo: IPaymentMethodRepository,
    private readonly stripeCustomerService: StripeCustomerService,
    private readonly userRepository: IUserRepository,
    private readonly stripe: StripeService
  ) {}

  @LogMethod()
  async handle(command: AddPaymentMethodCommand): Promise<void> {
    const { userId, paymentMethodId } = command;

    const user = await this.userRepository.findById(userId);

    if (!user || !user.email) {
      throw new InternalServerErrorException(`User not found`);
    }

    const customerId = await this.stripeCustomerService.getOrCreateCustomer(userId, user.email);

    const method = await this.stripe.attachPaymentMethod(customerId, paymentMethodId);

    if (!method.card) {
      throw new InternalServerErrorException(`Attached payment method does not contain card info`);
    }

    await this.paymentMethodRepo.create({
      userId,
      paymentMethodId: method.id,
      brand: method.card.brand,
      last4: method.card.last4,
      expMonth: method.card.exp_month,
      expYear: method.card.exp_year,
      isDefault: false,
    });
  }
}
