import { Controller, Post, Headers, Req, Res, HttpStatus, RawBodyRequest } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { Stripe } from 'stripe';
import { OneTimePurchaseService } from '../application/services/one-time-purchase.service';
import { SubscriptionService } from '../application/services/subscription.service';
import { ProcessVisitPaymentHandler } from '../../visit-booking/application/handler/process-visit-payment.handler';
import { ProcessVerificationPaymentHandler } from '../../residence-verification/application/handler/process-verification-payment.handler';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly oneTimePurchaseService: OneTimePurchaseService,
    private readonly subscriptionService: SubscriptionService,
    private readonly processVisitPaymentHandler: ProcessVisitPaymentHandler,
    private readonly processVerificationPaymentHandler: ProcessVerificationPaymentHandler
  ) {}

  @Post()
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string
  ) {
    console.log('🔥 WEBHOOK RECEIVED - Starting webhook processing');
    console.log('📝 Request headers:', req.headers);
    console.log('📝 Request body length:', req.rawBody?.length);
    
    let event: Stripe.Event;

    try {
      console.log('🔐 Processing signature:', signature);
      const payload = req.rawBody;
      event = this.stripeService.getEventFromWebhookPayload(payload as Buffer, signature);
      console.log('✅ Event parsed successfully:', event.type);
    } catch (err) {
      console.error('Invalid Stripe webhook signature.', err);
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }

    console.log('🎯 Processing event type:', event.type);
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Check if this is a visit booking payment
        if (session.metadata?.bookingId) {
          await this.processVisitPaymentHandler.handle(session);
        } 
        // Check if this is a residence verification payment
        else if (session.metadata?.verificationId) {
          console.log('Processing residence verification payment:', session.metadata.verificationId);
          // For verification payments, we'll handle them via payment_intent.succeeded
          // since the session doesn't contain all the payment details we need
        } 
        else if (session.mode === 'payment') {
          await this.oneTimePurchaseService.handleCompletedSession(session.id);
        } else if (session.mode === 'subscription') {
          await this.subscriptionService.handleCheckoutSessionCompleted(session);
        }
        break;
      }

      case 'payment_intent.succeeded': {  
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('💰 PAYMENT INTENT SUCCEEDED:', paymentIntent.id);
        console.log('💰 Payment intent status:', paymentIntent.status);
        console.log('💰 Payment intent metadata:', paymentIntent.metadata);
        
        // Check if this is a residence verification payment by looking for verification in database
        try {
          console.log('🔍 Looking for verification for payment intent:', paymentIntent.id);
          await this.processVerificationPaymentHandler.handle(paymentIntent);
        } catch (error) {
          if (error.message.includes('Residence verification not found')) {
            console.log('Payment intent is not for residence verification:', paymentIntent.id);
            // This payment intent is for other payment types (subscriptions, one-time purchases, etc.)
            // Let other handlers process it if needed
          } else {
            console.error('Error processing verification payment:', error);
            throw error;
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Check if this is a residence verification payment by looking for verification in database
        try {
          console.log('Processing failed payment intent:', paymentIntent.id);
          await this.processVerificationPaymentHandler.handle(paymentIntent);
        } catch (error) {
          if (error.message.includes('Residence verification not found')) {
            console.log('Failed payment intent is not for residence verification:', paymentIntent.id);
            // This payment intent is for other payment types (subscriptions, one-time purchases, etc.)
            // Let other handlers process it if needed
          } else {
            console.error('Error processing failed verification payment:', error);
            throw error;
          }
        }
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
