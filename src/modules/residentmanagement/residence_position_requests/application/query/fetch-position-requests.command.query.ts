import { User } from 'src/modules/user/domain/user.entity';
import { FetchPositionRequestsQuery } from '../command/fetch-position-requests.query';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { IResidencePositionRequestsRepository } from '../../domain/residence-position-requests.repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class fetchPositionRequestsCommandQuery {
  constructor(private readonly positionRequestRepository: IResidencePositionRequestsRepository) {}

  async handle(user: User, query: FetchPositionRequestsQuery) {
    const hasOwnPermission = user?.role.permissions?.includes(
      PermissionsEnum.POSITION_REQUESTS_READ_OWN
    );

    if (hasOwnPermission) {
      query.companyId = user.company?.id;
    }

    const result = await this.positionRequestRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
