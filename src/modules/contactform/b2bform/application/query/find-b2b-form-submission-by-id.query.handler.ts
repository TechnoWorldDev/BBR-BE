import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IB2BFormSubmissionRepository } from '../../domain/b2b-form-submission.repository.interface';
import { B2BFormSubmission } from '../../domain/b2b-form-submission.entity';

@Injectable()
export class FindB2BFormSubmissionByIdCommandQuery {
  constructor(private readonly b2bFormSubmissionRepository: IB2BFormSubmissionRepository) {}

  @LogMethod()
  async handle(id: string): Promise<B2BFormSubmission> {
    const form = await this.b2bFormSubmissionRepository.findById(id);
    if (!form) {
      throw new NotFoundException('B2B form submission not found');
    }
    return form;
  }
}
