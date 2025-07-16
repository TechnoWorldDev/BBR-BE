import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { IPhoneCodeRepository } from '../../domain/phone-code.repository.interface';
import { FetchPhoneCodesQuery } from '../command/fetch-phone-codes.query';
import { PhoneCode } from '../../domain/phone-code.entity';

@Injectable()
export class FetchPhoneCodesCommandQuery {
  constructor(private readonly phoneCodeRepository: IPhoneCodeRepository) {}

  @LogMethod()
  async handler(
    query: FetchPhoneCodesQuery
  ): Promise<{ data: PhoneCode[]; pagination: PaginationResponse }> {
    const result = await this.phoneCodeRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
