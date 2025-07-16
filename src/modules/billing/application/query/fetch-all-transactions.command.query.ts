import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { BillingTransaction } from '../../domain/billing-transaction.entity';
import { ITransactionRepository } from '../../domain/interfaces/transaction.repository.interface';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchTransactionsQuery } from '../commands/fetch-transactions.query';

@Injectable()
export class FetchAllTransactionsCommandQuery {
  constructor(private readonly transactionRepo: ITransactionRepository) {}

  @LogMethod()
  async handle(
    command: FetchTransactionsQuery
  ): Promise<{ data: BillingTransaction[]; pagination: PaginationResponse }> {
    const userId = command.userId;
    const result = await this.transactionRepo.findAllByUser(userId, command);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
