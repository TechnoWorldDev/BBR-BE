import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { BillingTransaction } from '../billing-transaction.entity';
import { FetchTransactionsQuery } from '../../application/commands/fetch-transactions.query';

export abstract class ITransactionRepository {
  abstract create(transaction: Partial<BillingTransaction>): Promise<void>;

  abstract findByInvoiceId(invoiceId: string): Promise<BillingTransaction | undefined>;

  abstract update(id: string, transaction: Partial<BillingTransaction>): Promise<void>;

  abstract findAllByUser(
    userId: string,
    query: FetchTransactionsQuery
  ): Promise<{ data: BillingTransaction[]; pagination: PaginationResponse }>;
}
