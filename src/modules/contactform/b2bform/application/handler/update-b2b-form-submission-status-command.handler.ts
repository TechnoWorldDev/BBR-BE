import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IB2BFormSubmissionRepository } from '../../domain/b2b-form-submission.repository.interface';
import { B2BFormSubmission } from '../../domain/b2b-form-submission.entity';
import { UpdateB2BFormSubmissionStatusCommand } from '../command/update-b2b-form-submission-status.command';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class UpdateB2BFormSubmissionStatusCommandHandler {
  constructor(
    private readonly b2bFormSubmissionRepository: IB2BFormSubmissionRepository,
  ) {}

  @LogMethod()
  async handle(command: UpdateB2BFormSubmissionStatusCommand): Promise<B2BFormSubmission> {
    const form = await this.b2bFormSubmissionRepository.findById(command.id);
    if (!form) {
      throw new NotFoundException('B2B Form Submission not found');
    }

    const updatedForm = await this.b2bFormSubmissionRepository.update(command.id, {
      status: command.status,
      name: form.name,
      phoneNumber: form.phoneNumber,
      email: form.email,
      pageOrigin: form.pageOrigin,
      companyName: form.companyName,
      brandedResidencesName: form.brandedResidencesName,
      companyWebsite: form.companyWebsite,
    });

    if (!updatedForm) {
      throw new InternalServerErrorException('Failed to update status');
    }

    return updatedForm;
  }
}
