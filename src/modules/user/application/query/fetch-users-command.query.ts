import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IUserRepository } from '../../domain/user.repository.interface';
import { FetchUsersQuery } from '../command/fetch-users.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { User } from '../../domain/user.entity';

@Injectable()
export class FetchUsersCommandHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  @LogMethod()
  async handle(query: FetchUsersQuery): Promise<{ data: User[]; pagination: PaginationResponse }> {
    const results = await this.userRepository.findAll(query);

    return {
      data: results.data,
      pagination: results.pagination,
    };
  }
}
