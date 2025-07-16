import { Module } from '@nestjs/common';
import { BillingController } from './ui/billing.controller';
import { PaymentMethodRepositoryImpl } from './infrastructure/payment-method.repository';
import { IPaymentMethodRepository } from './domain/interfaces/payment-method.repository.interface';
import { FetchAllPaymentMethodsByUserCommandQuery } from './application/query/fetch-all-payment-methods-by-user.command.query';
import { AddPaymentMethodCommandHandler } from './application/handlers/add-payment-method.command.handler';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { StripeCustomerService } from './application/services/stripe-customer.service';
import { IStripeCustomerRepository } from './domain/interfaces/stripe-customer.repository.interface';
import { StripeCustomerRepositoryImpl } from './infrastructure/stripe-customer.repository';
import { GenerateCheckoutOneTimeCommandHandler } from './application/handlers/generate-checkout-one-time.command.handler';
import { FetchAllProductsCommandQuery } from './application/query/fetch-all-products.command.query';
import { IBillingProductRepository } from './domain/interfaces/billing-product.repository.interface';
import { BillingProductRepositoryImpl } from './infrastructure/billing-product.repository';
import { CreateProductCommandHandler } from './application/handlers/create-product.command.handler';
import { GenerateCheckoutSubscriptionCommandHandler } from './application/handlers/generate-checkout-subscription.command.handler';
import { StripeWebhookController } from './ui/stripe-webhook.controller';
import { OneTimePurchaseService } from './application/services/one-time-purchase.service';
import { SubscriptionService } from './application/services/subscription.service';
import { TransactionRepositoryImpl } from './infrastructure/transaction.repository';
import { ITransactionRepository } from './domain/interfaces/transaction.repository.interface';
import { IEmailRepository } from '../email/domain/email.repository.interface';
import { EmailRepository } from '../email/infrastructure/email.repository';
import { IUserSubscriptionRepository } from './domain/interfaces/user-subscription.repository.interface';
import { UserSubscriptionRepositoryImpl } from './infrastructure/user-subscription.repository';
import { FetchAllTransactionsCommandQuery } from './application/query/fetch-all-transactions.command.query';
import { ICompanyRepository } from './domain/interfaces/company.repository.interface';
import { CompanyRepositoryImpl } from './infrastructure/company.repository.impl';
import { CompanyService } from './application/services/company.service';
import { IUserRepository } from './domain/interfaces/user.repository.interface';
import { UserRepositoryImpl } from './infrastructure/user.repository.impl';
import EmailModule from '../email/email.module';

@Module({
  controllers: [BillingController, StripeWebhookController],
  imports: [EmailModule],
  providers: [
    {
      provide: IPaymentMethodRepository,
      useClass: PaymentMethodRepositoryImpl,
    },
    {
      provide: IStripeCustomerRepository,
      useClass: StripeCustomerRepositoryImpl,
    },
    {
      provide: IBillingProductRepository,
      useClass: BillingProductRepositoryImpl,
    },
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: ITransactionRepository,
      useClass: TransactionRepositoryImpl,
    },
    {
      provide: IEmailRepository,
      useClass: EmailRepository,
    },
    {
      provide: IUserSubscriptionRepository,
      useClass: UserSubscriptionRepositoryImpl,
    },
    {
      provide: ICompanyRepository,
      useClass: CompanyRepositoryImpl,
    },
    FetchAllPaymentMethodsByUserCommandQuery,
    FetchAllProductsCommandQuery,
    FetchAllTransactionsCommandQuery,
    AddPaymentMethodCommandHandler,
    GenerateCheckoutOneTimeCommandHandler,
    GenerateCheckoutSubscriptionCommandHandler,
    CreateProductCommandHandler,
    OneTimePurchaseService,
    SubscriptionService,
    StripeService,
    StripeCustomerService,
    CompanyService,
  ],
  exports: [],
})
export class BillingModule {}
