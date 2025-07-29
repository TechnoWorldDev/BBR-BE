import { CreateProductCommand } from '../../application/commands/create-product.command';
import { GenerateCheckoutCommand } from '../../application/commands/generate-checkout.command';
import { BillingProduct } from '../../domain/billing-product.entity';
import { GenerateCheckoutOneTimeRequest } from '../requests/generate-checkout-one-time.request';
import { ProductResponse } from '../responses/product.response';
import { CreateProductRequest } from '../requests/create-product.request';

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

  static toCreateProductCommand(request: CreateProductRequest): CreateProductCommand {
    return new CreateProductCommand(
      request.name,
      request.featureKey,
      request.type,
      request.amount,
      request.currency,
      request.description,
      request.interval,
      request.isPremium
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
      product.interval,
      product.isPremium
    );
  }
}
