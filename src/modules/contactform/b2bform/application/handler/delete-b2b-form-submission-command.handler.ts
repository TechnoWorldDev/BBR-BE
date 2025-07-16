import { Injectable, NotFoundException } from '@nestjs/common';
import { IB2BFormSubmissionRepository } from '../../domain/b2b-form-submission.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class DeleteB2BFormSubmissionCommandHandler {
  constructor(private readonly b2bFormSubmissionRepository: IB2BFormSubmissionRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const form = await this.b2bFormSubmissionRepository.findById(id);

    if (!form) {
      throw new NotFoundException('B2B Form Submission not found');
    }

    await this.b2bFormSubmissionRepository.softDelete(id);
  }
}
