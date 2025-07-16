import { Injectable, NotFoundException } from '@nestjs/common';
import { ILeadRepository } from '../../domain/ilead.repository.interface';
import { Lead } from '../../domain/lead.entity';
import { User } from 'src/modules/user/domain/user.entity';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';

@Injectable()
export class FindLeadByIdCommandQuery {
  constructor(private readonly leadRepository: ILeadRepository) {}

  async handle(user: User, id: string): Promise<Lead> {
    const lead = await this.leadRepository.findById(id);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const hasOwnPermission = user?.role.permissions?.includes(PermissionsEnum.LEADS_READ_OWN);

    if (hasOwnPermission) {
      const ownLead = await this.leadRepository.findOwnById(user.company?.id!, id);
      if (!ownLead) {
        throw new NotFoundException('Lead not found');
      }

      return ownLead;
    }

    return lead;
  }
}
