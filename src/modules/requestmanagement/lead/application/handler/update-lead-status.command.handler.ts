import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ILeadRepository } from '../../domain/ilead.repository.interface';
import { Lead } from '../../domain/lead.entity';
import { UpdateLeadStatusCommand } from '../command/update-lead-status.command';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class UpdateLeadStatusCommandHandler {
  constructor(private readonly leadRepository: ILeadRepository) {}

  @LogMethod()
  async handle(command: UpdateLeadStatusCommand): Promise<Lead> {
    const existingLead = await this.leadRepository.findById(command.id);
    if (!existingLead) {
      throw new NotFoundException('Lead not found');
    }

    const updatedLeadData: Partial<Lead> = {
      firstName: existingLead.firstName,
      lastName: existingLead.lastName,
      email: existingLead.email,
      phone: existingLead.phone,
      preferredContactMethod: existingLead.preferredContactMethod,
      status: command.status,
    };

    const updatedLead = await this.leadRepository.update(command.id, updatedLeadData);
    if (!updatedLead) {
      throw new InternalServerErrorException('Lead status could not be updated');
    }

    return updatedLead;
  }
}
