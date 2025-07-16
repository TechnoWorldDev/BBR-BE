import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../../domain/interfaces/transaction.repository.interface';
import { BillingTransaction } from '../../domain/billing-transaction.entity';

@Injectable()
export class TransactionService {
  constructor(private readonly repo: ITransactionRepository) {}

  async create(transaction: Partial<BillingTransaction>) {
    return this.repo.create(transaction);
  }
}
