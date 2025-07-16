import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLeadCommand } from '../command/create-lead.command';
import { Lead } from '../../domain/lead.entity';
import { ILeadRepository } from '../../domain/ilead.repository.interface';
import { LeadStatusEnum } from '../../domain/lead-status.enum';

@Injectable()
export class CreateLeadCommandHandler {
  constructor(private readonly leadRepository: ILeadRepository) {}

  async handle(command: CreateLeadCommand): Promise<Lead> {

    const existingLead = await this.leadRepository.findByEmail(command.email);
    if (existingLead) {
      throw new ConflictException('Lead aldready exists');
    }

    const leadData :Partial<Lead> = {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
      status: LeadStatusEnum.NEW,
      preferredContactMethod: command.preferredContactMethod,
    }

    const lead = await this.leadRepository.create(leadData);

    if (!lead) {
      throw new InternalServerErrorException('Failed to create lead');
    }

    return lead;
  }
}
