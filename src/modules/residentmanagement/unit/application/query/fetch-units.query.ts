import { ForbiddenException, Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Unit } from '../../domain/unit.entity';
import { IUnitRepository } from '../../domain/unit.repository.interface';
import { FetchUnitsQuery } from '../command/fetch-units.query';
import { IMediaService } from '../../../../../shared/media/media.service.interface';
import { User } from 'src/modules/user/domain/user.entity';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { IResidenceRepository } from '../../domain/residence.repository.interface';

@Injectable()
export class FetchUnitsCommandQuery {
  constructor(
    private readonly unitRepository: IUnitRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly mediaService: IMediaService
  ) {}

  @LogMethod()
  async handle(
    user: User | null,
    query: FetchUnitsQuery
  ): Promise<{ data: Unit[]; pagination: PaginationResponse }> {
    const hasOwnPermission = user?.role.permissions?.includes(PermissionsEnum.UNITS_READ_OWN);

    if (!query.residenceId && hasOwnPermission) {
      throw new ForbiddenException('You do not have permission to view units.');
    }

    if (hasOwnPermission) {
      if (query.residenceId) {
        const residences = await this.residenceRepository.findByIds(query.residenceId);

        const isUserCompanyMatched = residences.every(
          (residence) => residence.company.id === user?.company?.id
        );

        if (!isUserCompanyMatched) {
          throw new ForbiddenException(
            'You do not have permission to view units for this residence.'
          );
        }
      }
    }

    const result = await this.unitRepository.findAll(query);

    const featureImages = result.data
      .map((unit) => unit.featureImage)
      .filter((image) => image !== undefined && image !== null);

    await this.mediaService.addTemporalUrls(featureImages);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
