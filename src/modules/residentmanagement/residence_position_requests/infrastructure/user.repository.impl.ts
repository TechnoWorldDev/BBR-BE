import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  @LogMethod()
  async findById(id: string): Promise<User | undefined> {
    return await User.query().findById(id).whereNull('deletedAt');
  }
}
