import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly knexService: KnexService) {}

  @LogMethod()
  async findByCompanyId(companyId: string): Promise<User | undefined> {
    return this.knexService
      .connection(User.tableName)
      .where({ company_id: companyId })
      .whereNull('deleted_at')
      .first();
  }
}
