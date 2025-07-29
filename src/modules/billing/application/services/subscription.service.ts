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
import { IUserRepository } from 'src/modules/user/domain/user.repository.interface';
import { CompanyService } from './company.service';
import { EmailAction } from 'src/modules/email/domain/email-action.enum';
import { EmailQueue } from 'src/modules/email/infrastructure/queues/email.queue';
import { ConfigService } from '@nestjs/config';
import { TwoTierSubscriptionService } from './two-tier-subscription.service';
import { IRankingCategoryRepository } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category.repository.interface';

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
    private readonly configService: ConfigService,
    private readonly twoTierSubscriptionService: TwoTierSubscriptionService,
    private readonly rankingCategoryRepo: IRankingCategoryRepository
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
    const residenceId = session.metadata?.residenceId;
    const rankingCategoryId = session.metadata?.rankingCategoryId;
    const subscriptionType = session.metadata?.subscriptionType;

    if (!userId || !subscriptionId || !residenceId) {
      console.error(
        '[stripe webhook]: Subscription has missing required metadata.',
        subscriptionId,
        userId,
        residenceId
      );
      return;
    }

    const sub: any = await this.stripe.getSubscription(subscriptionId);

    const items = sub.items?.data;
    if (!items?.length) {
      console.error('[stripe webhook]: Subscription has no items.', subscriptionId);
      return;
    }

    const priceId = items[0]?.price?.id;
    if (!priceId) {
      console.error('[stripe webhook]: Subscription has no price.', subscriptionId);
      return;
    }

    // First try to find a billing product
    let product = await this.productRepo.findByBillingPriceId(priceId);
    let isRankingCategory = false;

    // If no billing product found, try to find a ranking category
    if (!product) {
      console.log(`Billing product not found for priceId: ${priceId}, trying ranking category`);
      const rankingCategory = await this.rankingCategoryRepo.findByStripePriceId(priceId);
      if (rankingCategory) {
        console.log(`Found ranking category: ${rankingCategory.id} for priceId: ${priceId}`);
        // Create a mock product object for ranking categories
        product = {
          id: rankingCategory.id,
          stripeProductId: rankingCategory.id, // Use ranking category ID as product ID
          stripePriceId: priceId,
        } as any;
        isRankingCategory = true;
      } else {
        console.error(
          '[stripe webhook]: No product or ranking category found. priceId:',
          priceId,
          subscriptionId
        );
        return;
      }
    }

    const periodEndUnix = sub.current_period_end ?? items[0]?.current_period_end;
    if (!periodEndUnix) return;

    // Check if subscription already exists to prevent duplicates
    const existingSubscription = await this.subscriptionRepo.findBySubscriptionId(sub.id);
    if (existingSubscription.length > 0) {
      console.log(`[stripe webhook]: Subscription ${sub.id} already exists in database, skipping creation`);
      return;
    }

    console.log(`[stripe webhook]: Creating subscription ${sub.id} for user ${userId}, residence ${residenceId}`);

    // Create subscription using the two-tier service
    await this.twoTierSubscriptionService.createSubscription({
      userId,
      productId: product!.id,
      subscriptionId: sub.id,
      currentPeriodEnd: new Date(periodEndUnix * 1000),
      status: mapStripeSubscriptionStatusToEnum(sub.status),
      residenceId,
      rankingCategoryId,
      metadata: {
        stripeSubscriptionId: sub.id,
        stripePriceId: priceId,
        subscriptionType,
      },
    });

    if (items.length) {
      // Record the very first invoice as a transaction
      if (sub.latest_invoice) {
        const invoice = await this.stripe.getInvoice(sub.latest_invoice as string);

        const amountPaid = (invoice.amount_paid ?? 0) / 100;
        const currency = invoice.currency!;
        const stripeInvoiceId = invoice.id;
        const stripePaymentIntentId = (invoice as any)?.payment_intent || '';

        const transaction = await this.transactionRepo.findByInvoiceId(invoice.id!);

        const createdTransaction = {
          userId,
          stripePaymentIntentId,
          stripeInvoiceId,
          stripeProductId: product!.stripeProductId,
          stripePriceId: priceId,
          type: BillingProductTypeEnum.SUBSCRIPTION,
          amount: amountPaid,
          currency,
          status: invoice.status!,
          stripeHostingInvoiceUrl: invoice.hosted_invoice_url!,
        };

        if (transaction) {
          await this.transactionRepo.update(transaction.id, createdTransaction);
        } else {
          await this.transactionRepo.create(createdTransaction);
        }
      }
    }

    // Send email notification
    const user = await this.userRepository.findById(userId);
    if (user) {
      await this.emailQueue.addEmailJob(EmailAction.PREMIUM_SUBSCRIPTION, {
        to: user.email,
        variables: {
          fullName: `${user.fullName}`,
          manageResidencesLink: `${this.configService.get<string>('FRONTEND_URL')}/developer/residences`,
        },
      });
    }
  }

  async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    console.log('Processing invoice paid event:', invoice.id);
    
    const subscriptionId = (invoice as any).subscription as string;
    const sub = await this.stripe.getSubscription(subscriptionId);

    const userId = sub.metadata?.userId;
    const residenceId = sub.metadata?.residenceId;
    const rankingCategoryId = sub.metadata?.rankingCategoryId;
    const subscriptionType = sub.metadata?.subscriptionType;

    console.log('Subscription metadata:', { userId, residenceId, rankingCategoryId, subscriptionType });

    if (!userId || !residenceId) {
      console.log('Missing userId or residenceId in subscription metadata');
      return;
    }

    const items = sub.items?.data;
    if (!items?.length) return;

    for (const item of items) {
      const priceId = item.price?.id;
      if (!priceId) continue;

      // First try to find a billing product
      let product = await this.productRepo.findByBillingPriceId(priceId);
      let isRankingCategory = false;

      // If no billing product found, try to find a ranking category
      if (!product) {
        console.log(`Billing product not found for priceId: ${priceId}, trying ranking category`);
        const rankingCategory = await this.rankingCategoryRepo.findByStripePriceId(priceId);
        if (rankingCategory) {
          console.log(`Found ranking category: ${rankingCategory.id} for priceId: ${priceId}`);
          // Create a mock product object for ranking categories
          product = {
            id: rankingCategory.id,
            stripeProductId: rankingCategory.id, // Use ranking category ID as product ID
            stripePriceId: priceId,
          } as any;
          isRankingCategory = true;
        } else {
          console.log(`No product or ranking category found for priceId: ${priceId}`);
          continue;
        }
      }
      
      if (!product || !product.stripeProductId) {
        console.log(`Product ${product?.id} has no stripeProductId`);
        continue;
      }

      const periodEndUnix = item.current_period_end;
      if (!periodEndUnix) continue;

      // Check if subscription already exists to prevent duplicates
      const existingSubscription = await this.subscriptionRepo.findBySubscriptionId(sub.id);
      if (existingSubscription.length > 0) {
        console.log(`[stripe webhook invoice]: Subscription ${sub.id} already exists in database, skipping creation`);
        continue;
      }

      console.log(`[stripe webhook invoice]: Creating subscription ${sub.id} for user ${userId}, residence ${residenceId}`);

      // Update subscription using the two-tier service
      await this.twoTierSubscriptionService.createSubscription({
        userId,
        productId: product.id,
        subscriptionId: sub.id,
        currentPeriodEnd: new Date(periodEndUnix * 1000),
        status: mapStripeSubscriptionStatusToEnum(sub.status),
        residenceId,
        rankingCategoryId,
        metadata: {
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId,
          subscriptionType,
        },
      });

      const transaction = await this.transactionRepo.findByInvoiceId(invoice.id!);

      const createdTransaction = {
        userId,
        stripePaymentIntentId: (invoice as any).payment_intent || '',
        stripeInvoiceId: invoice.id,
        stripeProductId: product.stripeProductId,
        stripePriceId: priceId,
        type: BillingProductTypeEnum.SUBSCRIPTION,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: invoice.status!,
        stripeHostingInvoiceUrl: invoice.hosted_invoice_url || '',
      };

      console.log('Creating transaction:', createdTransaction);

      try {
        if (transaction) {
          await this.transactionRepo.update(transaction.id, createdTransaction);
          console.log('Transaction updated successfully');
        } else {
          await this.transactionRepo.create(createdTransaction);
          console.log('Transaction created successfully');
        }
      } catch (error) {
        console.error('Failed to create/update transaction:', error);
        throw error;
      }

      // Send invoice email with proper data
      const pdfUrl = invoice.invoice_pdf;
      const htmlUrl = invoice.hosted_invoice_url;
      if (pdfUrl && htmlUrl && invoice.customer_email) {
        // Get user information for the invoice
        const user = await this.userRepository.findById(userId);
        
        // Prepare invoice data for the template
        const invoiceData = {
          customerName: user?.fullName || 'Customer',
          date: new Date(),
          items: [
            {
              name: isRankingCategory 
                ? `Ranking Category Subscription - ${product.id}` 
                : `Residence Subscription - ${product.id}`,
              quantity: 1,
              price: invoice.amount_paid / 100,
            }
          ],
          subTotal: invoice.amount_paid / 100,
          tax: 0,
          taxAmount: 0,
          total: invoice.amount_paid / 100,
          pdf: pdfUrl,
          html: htmlUrl,
        };
        
        await this.emailRepository.sendInvoice(invoice.customer_email, 'Invoice', pdfUrl, htmlUrl, invoiceData);
      }
    }
  }

  async handleInvoiceFailed(invoice: Stripe.Invoice) {
    const subscriptionId = (invoice as any).subscription as string;
    if (!subscriptionId) return;
    await this.subscriptionRepo.markFailed(subscriptionId);
  }

  async handleSubscriptionUpdated(sub: Stripe.Subscription) {
    const userId = sub.metadata?.userId;
    const residenceId = sub.metadata?.residenceId;
    const rankingCategoryId = sub.metadata?.rankingCategoryId;
    const subscriptionType = sub.metadata?.subscriptionType;

    if (!userId || !residenceId) return;

    for (const item of sub.items.data) {
      const priceId = item.price.id;
      
      // First try to find a billing product
      let product = await this.productRepo.findByBillingPriceId(priceId);
      let isRankingCategory = false;

      // If no billing product found, try to find a ranking category
      if (!product) {
        console.log(`Billing product not found for priceId: ${priceId}, trying ranking category`);
        const rankingCategory = await this.rankingCategoryRepo.findByStripePriceId(priceId);
        if (rankingCategory) {
          console.log(`Found ranking category: ${rankingCategory.id} for priceId: ${priceId}`);
          // Create a mock product object for ranking categories
          product = {
            id: rankingCategory.id,
            stripeProductId: rankingCategory.id, // Use ranking category ID as product ID
            stripePriceId: priceId,
          } as any;
          isRankingCategory = true;
        } else {
          console.log(`No product or ranking category found for priceId: ${priceId}`);
          continue;
        }
      }
      
      if (!product || !product.stripeProductId) {
        console.log(`Product ${product?.id} has no stripeProductId`);
        continue;
      }

      const currentPeriodEnd = item.current_period_end;

      await this.twoTierSubscriptionService.createSubscription({
        userId,
        productId: product.id,
        subscriptionId: sub.id,
        currentPeriodEnd: new Date(currentPeriodEnd * 1000),
        status: mapStripeSubscriptionStatusToEnum(sub.status),
        residenceId,
        rankingCategoryId,
        metadata: {
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId,
          subscriptionType,
        },
      });
    }
  }
}
