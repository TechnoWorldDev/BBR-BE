import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || 'not_defined', {
      apiVersion: '2025-06-30.basil',
    });
  }

  createCheckoutSession(params: Stripe.Checkout.SessionCreateParams) {
    return this.stripe.checkout.sessions.create(params);
  }

  getCheckoutSession(sessionId: string, options?: { expand?: string[] }) {
    return this.stripe.checkout.sessions.retrieve(sessionId, options);
  }

  getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  cancelSubscription(subscriptionId: string) {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }

  getEventFromWebhookPayload(signature: string, payload: Buffer) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || 'not_defined'
    );
  }

  createCustomer(params: Stripe.CustomerCreateParams) {
    return this.stripe.customers.create(params);
  }

  retrieveCustomer(customerId: string) {
    return this.stripe.customers.retrieve(customerId);
  }

  listCustomerByEmail(email: string): Promise<Stripe.ApiSearchResult<Stripe.Customer>> {
    return this.stripe.customers.search({
      query: `email:"${email}"`,
      limit: 1,
    });
  }

  listPrices(params?: Stripe.PriceListParams) {
    return this.stripe.prices.list(params);
  }

  listProducts(params?: Stripe.ProductListParams) {
    return this.stripe.products.list(params);
  }

  createPaymentMethod(params: Stripe.PaymentMethodCreateParams) {
    return this.stripe.paymentMethods.create(params);
  }

  attachPaymentMethod(customerId: string, paymentMethodId: string) {
    return this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }

  detachPaymentMethod(paymentMethodId: string) {
    return this.stripe.paymentMethods.detach(paymentMethodId);
  }

  setDefaultPaymentMethod(customerId: string, paymentMethodId: string) {
    return this.stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  }

  getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    return this.stripe.invoices.retrieve(invoiceId);
  }

  createProduct(params: Stripe.ProductCreateParams): Promise<Stripe.Product> {
    return this.stripe.products.create(params);
  }

  createPrice(params: Stripe.PriceCreateParams): Promise<Stripe.Price> {
    return this.stripe.prices.create(params);
  }

  updateProduct(productId: string, params: Stripe.ProductUpdateParams): Promise<Stripe.Product> {
    return this.stripe.products.update(productId, params);
  }
}
