import { Injectable } from '@nestjs/common';
import { BillingTransaction } from '../domain/billing-transaction.entity';
import { ITransactionRepository } from '../domain/interfaces/transaction.repository.interface';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { applyFilters } from 'src/shared/filters/query.dynamic-filters';
import { FetchTransactionsQuery } from '../application/commands/fetch-transactions.query';
import { applyPagination } from 'src/shared/utils/pagination.util';
@Injectable()
export class TransactionRepositoryImpl implements ITransactionRepository {
  async create(transaction: Partial<BillingTransaction>): Promise<void> {
    await BillingTransaction.query().insert({
      userId: transaction.userId,
      stripePaymentIntentId: transaction.stripePaymentIntentId,
      stripeInvoiceId: transaction.stripeInvoiceId,
      stripeProductId: transaction.stripeProductId,
      stripePriceId: transaction.stripePriceId,
      stripeHostingInvoiceUrl: transaction.stripeHostingInvoiceUrl,
      type: transaction.type,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
    });
  }

  async findAllByUser(
    userId: string,
    query: FetchTransactionsQuery
  ): Promise<{ data: BillingTransaction[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery, type, status } = query;

    let transactionsQuery = BillingTransaction.query()
      .modify((qb) => applyFilters(qb, { status, type }, BillingTransaction.tableName))
      .where('user_id', userId)
      .withGraphFetched('[customer, user]');

    const columnsToSearch = ['amount'];

    if (sortBy && sortOrder) {
      const columnsToSort = [
        'billing_transactions.created_at',
        'billing_transactions.status',
        'billing_transactions.amount',
        'billing_transactions.type',
      ];
      if (columnsToSort.includes(sortBy)) {
        transactionsQuery = transactionsQuery.orderBy(sortBy, sortOrder);
      }
    }

    transactionsQuery = applySearchFilter(transactionsQuery, searchQuery, columnsToSearch);

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      transactionsQuery,
      page,
      limit
    );

    return {
      data: paginatedQuery,
      pagination: {
        total: totalCount,
        totalPages,
        page: page,
        limit: limit,
      },
    };
  }

  async update(id: string, transaction: Partial<BillingTransaction>): Promise<void> {
    await BillingTransaction.query().where('id', id).update(transaction);
  }

  async findByInvoiceId(invoiceId: string): Promise<BillingTransaction | undefined> {
    return BillingTransaction.query().where('stripe_invoice_id', invoiceId).first();
  }
}
