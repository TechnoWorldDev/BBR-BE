import { Controller, Post, Headers, Req, Res, HttpStatus, RawBodyRequest } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { Stripe } from 'stripe';
import { OneTimePurchaseService } from '../application/services/one-time-purchase.service';
import { SubscriptionService } from '../application/services/subscription.service';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly oneTimePurchaseService: OneTimePurchaseService,
    private readonly subscriptionService: SubscriptionService
    // private readonly invoicePaidHandler: HandleInvoicePaidCommandHandler,
    // private readonly invoicePaymentFailedHandler: HandleInvoicePaymentFailedCommandHandler,
  ) {}

  @Post()
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string
  ) {
    let event: Stripe.Event;

    try {
      console.log('signature', signature);
      const payload = req.rawBody;
      event = this.stripeService.getEventFromWebhookPayload(payload as Buffer, signature);
    } catch (err) {
      console.error('Invalid Stripe webhook signature.', err);
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'payment') {
          await this.oneTimePurchaseService.handleCompletedSession(session.id);
        } else if (session.mode === 'subscription') {
          await this.subscriptionService.handleCheckoutSessionCompleted(session);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // await this.paymentIntentSucceededHandler.handle(paymentIntent);
        console.log('payment intent webhook');
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // await this.paymentIntentFailedHandler.handle(paymentIntent);
        console.log('payment intent failed webhook');
        break;
      }

      case 'invoice.paid': {
        await this.subscriptionService.handleInvoicePaid(event.data.object as Stripe.Invoice);
        console.log('invoice webhook');
        break;
      }

      case 'invoice.payment_failed': {
        await this.subscriptionService.handleInvoiceFailed(event.data.object as Stripe.Invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return res.status(HttpStatus.OK).send({ received: true });
  }
}
