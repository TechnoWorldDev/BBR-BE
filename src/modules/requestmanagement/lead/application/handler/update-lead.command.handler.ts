import {
  Injectable,
  NotFoundException,
  InternalServerErrorException, ConflictException,
} from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { ILeadRepository } from '../../domain/ilead.repository.interface';
import { Lead } from '../../domain/lead.entity';
import { UpdateLeadCommand } from '../command/update-lead.command';

@Injectable()
export class UpdateLeadCommandHandler {
  constructor(private readonly leadRepository: ILeadRepository) {}

  @LogMethod()
  async handle(command: UpdateLeadCommand): Promise<Lead> {
    const existingLead = await this.leadRepository.findById(command.id);
    if (!existingLead) {
      throw new NotFoundException('Lead not found');
    }

    const leadWithSameEmail = await this.leadRepository.findByEmail(command.email);
    if (leadWithSameEmail && leadWithSameEmail.id !== command.id) {
      throw new ConflictException('A lead with this email already exists');
    }

    const updatedLeadData: Partial<Lead> = {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
      preferredContactMethod: command.preferredContactMethod,
    };

    const updatedLead = await this.leadRepository.update(command.id, updatedLeadData);
    if (!updatedLead) {
      throw new InternalServerErrorException('Lead could not be updated');
    }

    return updatedLead;
  }
}
