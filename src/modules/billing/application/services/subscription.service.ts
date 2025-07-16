import { Injectable } from '@nestjs/common';
import { IEmailRepository } from 'src/modules/email/domain/email.repository.interface';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { BillingProductTypeEnum } from 'src/shared/types/product-type.enum';
import { mapStripeSubscriptionStatusToEnum } from 'src/shared/types/subscription-status.enum';
import Stripe from 'stripe';
import { IBillingProductRepository } from '../../domain/interfaces/billing-product.repository.interface';
import { ITransactionRepository } from '../../domain/interfaces/transaction.repository.interface';
import { IUserSubscriptionRepository } from '../../domain/interfaces/user-subscription.repository.interface';
import { StripeCustomerService } from './stripe-customer.service';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { CompanyService } from './company.service';
import { EmailAction } from 'src/modules/email/domain/email-action.enum';
import { EmailQueue } from 'src/modules/email/infrastructure/queues/email.queue';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly stripe: StripeService,
    private readonly stripeCustomerService: StripeCustomerService,
    private readonly subscriptionRepo: IUserSubscriptionRepository,
    private readonly productRepo: IBillingProductRepository,
    private readonly transactionRepo: ITransactionRepository,
    private readonly emailRepository: IEmailRepository,
    private readonly userRepository: IUserRepository,
    private readonly companyService: CompanyService,
    private readonly emailQueue: EmailQueue,
    private readonly configService: ConfigService
  ) {}

  async createCheckout(
    userId: string,
    priceId: string,
    email: string,
    successUrl: string,
    cancelUrl: string
  ) {
    const customerId = await this.stripeCustomerService.getOrCreateCustomer(userId, email);

    return this.stripe.createCheckoutSession({
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      metadata: { userId },
      line_items: [{ price: priceId, quantity: 1 }],
    });
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const subscriptionId = session.subscription as string;
    const userId = session.metadata?.userId;

    if (!userId || !subscriptionId) {
      console.error(
        '[stripe wehbook]: Subscription has no userId or subscriptionId.',
        subscriptionId,
        userId
      );
      return;
    }

    const sub: any = await this.stripe.getSubscription(subscriptionId);

    const items = sub.items?.data;
    if (!items?.length) {
      console.error('[stripe wehbook]: Subscription has no items.', subscriptionId);
      return;
    }

    const priceId = items[0]?.price?.id;
    if (!priceId) {
      console.error('[stripe wehbook]: Subscription has no price.', subscriptionId);
      return;
    }

    const product = await this.productRepo.findByBillingPriceId(priceId);
    if (!product) {
      console.error(
        '[stripe wehbook]: Subscription has no product. priceId:',
        priceId,
        subscriptionId
      );
      return;
    }

    const periodEndUnix = sub.current_period_end ?? items[0]?.current_period_end;
    if (!periodEndUnix) return;

    await this.subscriptionRepo.upsert({
      userId,
      productId: product.id,
      subscriptionId: sub.id,
      currentPeriodEnd: new Date(periodEndUnix * 1000),
      status: mapStripeSubscriptionStatusToEnum(sub.status),
    });

    if (items.length) {
      await this.subscriptionRepo.upsert({
        userId,
        subscriptionId: sub.id,
        productId: product.id,
        currentPeriodEnd: new Date(periodEndUnix * 1000),
        status: mapStripeSubscriptionStatusToEnum(sub.status),
      });

      // 3) Now immediately record the very first invoice as a transaction
      if (sub.latest_invoice) {
        const invoice = await this.stripe.getInvoice(sub.latest_invoice as string);

        // figure out amount_paid & currency
        const amountPaid = (invoice.amount_paid ?? 0) / 100;
        const currency = invoice.currency!;
        const stripeInvoiceId = invoice.id;
        const stripePaymentIntentId = (invoice as any)?.payment_intent || '';

        const transaction = await this.transactionRepo.findByInvoiceId(invoice.id!);

        const createdTransaction = {
          userId,
          stripePaymentIntentId,
          stripeInvoiceId,
          stripeProductId: product.stripeProductId,
          stripePriceId: priceId,
          type: BillingProductTypeEnum.SUBSCRIPTION,
          amount: amountPaid,
          currency,
          status: invoice.status!, // usually “paid”
          stripeHostingInvoiceUrl: invoice.hosted_invoice_url!,
        };

        if (transaction) {
          await this.transactionRepo.update(transaction.id, createdTransaction);
        } else {
          await this.transactionRepo.create(createdTransaction);
        }
      }
    }

    // update user plan
    const user = await this.userRepository.findById(userId);

    if (!user) return;

    await this.companyService.updatePlan(user.companyId, product.stripeProductId);

    // send email
    await this.emailQueue.addEmailJob(EmailAction.PREMIUM_SUBSCRIPTION, {
      to: user.email,
      variables: {
        fullName: `${user.fullName}`,
        manageResidencesLink: `${this.configService.get<string>('FRONTEND_URL')}/developer/residences`,
      },
    });
  }

  async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    const subscriptionId = (invoice as any).subscription as string;
    const sub = await this.stripe.getSubscription(subscriptionId);

    const userId = sub.metadata?.userId;
    if (!userId) return;

    const items = sub.items?.data;
    if (!items?.length) return;

    for (const item of items) {
      const priceId = item.price?.id;
      if (!priceId) continue;

      const product = await this.productRepo.findByBillingPriceId(priceId);
      if (!product) continue;

      const periodEndUnix = item.current_period_end;
      if (!periodEndUnix) continue;

      await this.subscriptionRepo.upsert({
        userId,
        productId: product.id,
        subscriptionId: sub.id,
        currentPeriodEnd: new Date(periodEndUnix * 1000),
        status: mapStripeSubscriptionStatusToEnum(sub.status),
      });

      const transaction = await this.transactionRepo.findByInvoiceId(invoice.id!);

      const createdTransaction = {
        userId,
        stripePaymentIntentId: (invoice as any).payment_intent,
        stripeInvoiceId: invoice.id,
        stripeProductId: product.stripeProductId,
        stripePriceId: priceId,
        type: BillingProductTypeEnum.SUBSCRIPTION,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: invoice.status!, // 'paid'
        stripeHostingInvoiceUrl: invoice.hosted_invoice_url!,
      };

      if (transaction) {
        await this.transactionRepo.update(transaction.id, createdTransaction);
      } else {
        await this.transactionRepo.create(createdTransaction);
      }
    }

    const pdfUrl = invoice.invoice_pdf;
    const htmlUrl = invoice.hosted_invoice_url;
    if (pdfUrl && htmlUrl && invoice.customer_email) {
      await this.emailRepository.sendInvoice(invoice.customer_email, 'Invoice', pdfUrl, htmlUrl);
    }
  }

  async handleInvoiceFailed(invoice: Stripe.Invoice) {
    const subscriptionId = (invoice as any).subscription as string;
    if (!subscriptionId) return;
    await this.subscriptionRepo.markFailed(subscriptionId);
  }

  async handleSubscriptionUpdated(sub: Stripe.Subscription) {
    const userId = sub.metadata?.userId;
    if (!userId) return;

    for (const item of sub.items.data) {
      const priceId = item.price.id;
      const product = await this.productRepo.findByBillingPriceId(priceId);
      if (!product) continue;

      const currentPeriodEnd = item.current_period_end;

      await this.subscriptionRepo.upsert({
        userId,
        subscriptionId: sub.id,
        productId: product.id,
        currentPeriodEnd: new Date(currentPeriodEnd * 1000),
        status: mapStripeSubscriptionStatusToEnum(sub.status),
      });

      const user = await this.userRepository.findById(userId);

      if (!user) continue;

      await this.companyService.updatePlan(user.companyId, product.id);
    }
  }
}
