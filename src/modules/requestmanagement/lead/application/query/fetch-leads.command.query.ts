import { ForbiddenException, Injectable } from '@nestjs/common';
import { ILeadRepository } from '../../domain/ilead.repository.interface';
import { FetchLeadsQuery } from '../command/fetch-leads.query';
import { Lead } from '../../domain/lead.entity';
import { PaginationResponse } from '../../../../../shared/ui/response/pagination.response';
import { User } from 'src/modules/user/domain/user.entity';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';

@Injectable()
export class FetchLeadsCommandQuery {
  constructor(private readonly leadRepository: ILeadRepository) {}

  async handle(
    user: User,
    query: FetchLeadsQuery
  ): Promise<{ data: Lead[]; pagination: PaginationResponse }> {
    const hasOwnPermission = user?.role.permissions?.includes(PermissionsEnum.LEADS_READ_OWN);

    if (hasOwnPermission) {
      query.companyId = user.company?.id;
    }

    const result = await this.leadRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
