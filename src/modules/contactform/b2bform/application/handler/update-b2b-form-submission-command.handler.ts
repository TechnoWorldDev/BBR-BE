import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IB2BFormSubmissionRepository } from '../../domain/b2b-form-submission.repository.interface';
import { B2BFormSubmission } from '../../domain/b2b-form-submission.entity';
import { UpdateB2BFormSubmissionCommand } from '../command/update-b2b-form-submission.command';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class UpdateB2BFormSubmissionCommandHandler {
  constructor(
    private readonly b2bFormSubmissionRepository: IB2BFormSubmissionRepository,
  ) {}

  @LogMethod()
  async handle(command: UpdateB2BFormSubmissionCommand): Promise<B2BFormSubmission> {
    const form = await this.b2bFormSubmissionRepository.findById(command.id);
    if (!form) {
      throw new NotFoundException('B2B Form Submission not found');
    }

    const updateData: Partial<B2BFormSubmission> = {
      name: command.name,
      phoneNumber: command.phoneNumber,
      email: command.email,
      pageOrigin: command.pageOrigin,
      companyName: command.companyName,
      brandedResidencesName: command.brandedResidencesName,
      companyWebsite: command.companyWebsite,
      status: command.status,
    };

    const updatedForm = await this.b2bFormSubmissionRepository.update(command.id, updateData);

    if (!updatedForm) {
      throw new InternalServerErrorException('B2B Form Submission not updated');
    }

    return updatedForm;
  }
}
