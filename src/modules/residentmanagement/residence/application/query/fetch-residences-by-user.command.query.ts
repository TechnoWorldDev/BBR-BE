import { ForbiddenException, Injectable } from '@nestjs/common';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { FetchResidencesQuery } from '../commands/fetch-residences.query';
import { User } from 'src/modules/user/domain/user.entity';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';

@Injectable()
export class FetchResidencesByUserCommandQuery {
  constructor(private readonly residenceRepository: IResidenceRepository) {}

  async handle(user: User, query: FetchResidencesQuery) {
    const hasOwnPermission = user?.role.permissions?.includes(PermissionsEnum.RESIDENCES_READ_OWN);

    if (!hasOwnPermission) {
      throw new ForbiddenException('You do not have permission to view residences.');
    }

    const result = await this.residenceRepository.findAllByUser(user, query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
