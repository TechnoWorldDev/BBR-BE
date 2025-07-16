import { Injectable, NotFoundException } from '@nestjs/common';
import { IRequestRepository } from '../../domain/irequest.repository.interface';
import { Request } from '../../domain/request.entity';
import { User } from 'src/modules/user/domain/user.entity';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';

@Injectable()
export class FindRequestByIdCommandQuery {
  constructor(private readonly requestRepository: IRequestRepository) {}

  async handle(user: User, id: string): Promise<Request> {
    const request = await this.requestRepository.findById(id);

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    const hasOwnPermission = user?.role.permissions?.includes(PermissionsEnum.REQUESTS_READ_OWN);

    if (hasOwnPermission) {
      const ownLead = await this.requestRepository.findOwnById(user.company?.id!, id);
      if (!ownLead) {
        throw new NotFoundException('Request not found');
      }

      return ownLead;
    }

    return request;
  }
}
