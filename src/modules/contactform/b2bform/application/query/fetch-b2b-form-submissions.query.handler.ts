import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { B2BFormSubmission } from '../../domain/b2b-form-submission.entity';
import { IB2BFormSubmissionRepository } from '../../domain/b2b-form-submission.repository.interface';
import { FetchB2BFormSubmissionsQuery } from '../command/fetch-b2b-form-submissions.query';

@Injectable()
export class FetchB2BFormSubmissionsCommandQuery {
  constructor(private readonly b2bFormSubmissionRepository: IB2BFormSubmissionRepository) {}

  @LogMethod()
  async handle(
    query: FetchB2BFormSubmissionsQuery
  ): Promise<{ data: B2BFormSubmission[]; pagination: PaginationResponse }> {
    const result = await this.b2bFormSubmissionRepository.findAll(query);
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
