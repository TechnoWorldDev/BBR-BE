import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BillingProduct } from '../../domain/billing-product.entity';
import { IBillingProductRepository } from '../../domain/interfaces/billing-product.repository.interface';
import { CreateProductCommand } from '../commands/create-product.command';
import { StripeService } from 'src/shared/stripe/stripe.service';
import Stripe from 'stripe';
import { BillingProductTypeEnum } from 'src/shared/types/product-type.enum';

@Injectable()
export class CreateProductCommandHandler {
  constructor(
    private readonly billingProductRepository: IBillingProductRepository,
    private readonly stripe: StripeService
  ) {}

  async handle(command: CreateProductCommand): Promise<BillingProduct> {
    const stripeProduct = await this.stripe.createProduct({
      name: command.name,
      description: command.description,
    });

    const stripePrice = await this.stripe.createPrice({
      product: stripeProduct.id,
      unit_amount: Math.round(command.amount * 100),
      currency: command.currency.toLowerCase(),
      recurring:
        command.type === BillingProductTypeEnum.SUBSCRIPTION
          ? {
              interval: (command.interval?.toLowerCase() ||
                'month') as Stripe.PriceCreateParams.Recurring.Interval, // default je month ako ne proslediš
            }
          : undefined,
    });

    if (!stripeProduct || !stripePrice) {
      throw new InternalServerErrorException('Product not created');
    }

    const createProduct = {
      name: command.name,
      description: command.description,
      featureKey: command.featureKey,
      type: command.type,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
      amount: command.amount,
      currency: command.currency,
      interval: command.interval,
      isPremium: command.isPremium || false,
    };

    // 3. Insert u lokalnu bazu
    const createdProduct = await this.billingProductRepository.create(createProduct);

    if (!createdProduct) {
      throw new InternalServerErrorException('Product not created');
    }

    return createdProduct;
  }
}
