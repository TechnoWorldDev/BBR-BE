import { Injectable } from '@nestjs/common';
import { IRequestRepository } from '../../domain/irequest.repository.interface';
import { FetchRequestsQuery } from '../command/fetch-requests.query';
import { Request } from '../../domain/request.entity';
import { PaginationResponse } from '../../../../../shared/ui/response/pagination.response';
import { User } from 'src/modules/user/domain/user.entity';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';

@Injectable()
export class FetchRequestsCommandQuery {
  constructor(private readonly requestRepository: IRequestRepository) {}

  async handle(
    user: User,
    query: FetchRequestsQuery
  ): Promise<{ data: Request[]; pagination: PaginationResponse }> {
    const hasOwnPermission = user?.role.permissions?.includes(PermissionsEnum.REQUESTS_READ_OWN);

    if (hasOwnPermission) {
      query.companyId = user.company?.id;
    }

    const result = await this.requestRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
