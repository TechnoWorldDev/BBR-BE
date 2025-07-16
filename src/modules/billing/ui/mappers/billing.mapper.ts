import { CreateProductCommand } from '../../application/commands/create-product.command';
import { GenerateCheckoutCommand } from '../../application/commands/generate-checkout.command';
import { BillingProduct } from '../../domain/billing-product.entity';
import { GenerateCheckoutOneTimeRequest } from '../requests/generate-checkout-one-time.request';
import { ProductResponse } from '../responses/product.response';

export class BillingMapper {
  static toGenerateCheckoutOneTimeCommand(
    userId: string,
    email: string,
    request: GenerateCheckoutOneTimeRequest
  ): GenerateCheckoutCommand {
    return new GenerateCheckoutCommand(
      userId,
      request.priceId,
      email,
      request.successUrl,
      request.cancelUrl,
      request.metadata
    );
  }
  static toGenerateCheckoutSubscriptionCommand(
    userId: string,
    email: string,
    request: GenerateCheckoutOneTimeRequest
  ): GenerateCheckoutCommand {
    return new GenerateCheckoutCommand(
      userId,
      request.priceId,
      email,
      request.successUrl,
      request.cancelUrl,
      request.metadata
    );
  }

  static toCreateProductCommand(command: CreateProductCommand): CreateProductCommand {
    return new CreateProductCommand(
      command.name,
      command.featureKey,
      command.type,
      command.amount,
      command.currency,
      command.description,
      command.interval
    );
  }
  static toProductResponse(product: BillingProduct): ProductResponse {
    return new ProductResponse(
      product.id,
      product.name,
      product.description,
      product.featureKey,
      product.type,
      product.stripeProductId,
      product.stripePriceId,
      product.amount,
      product.currency,
      product.active,
      product.interval
    );
  }
}
