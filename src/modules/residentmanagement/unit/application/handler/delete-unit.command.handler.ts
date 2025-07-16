import { Injectable, NotFoundException } from '@nestjs/common';
import { IUnitRepository } from '../../domain/unit.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { User } from 'src/modules/user/domain/user.entity';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { Unit } from '../../domain/unit.entity';

@Injectable()
export class DeleteUnitCommandHandler {
  constructor(private readonly unitRepository: IUnitRepository) {}

  @LogMethod()
  async handle(user: User, id: string): Promise<void> {
    const hasOwnPermission = user?.role.permissions?.includes(PermissionsEnum.UNITS_DELETE_OWN);
    let unit: Unit | undefined;

    if (hasOwnPermission) {
      unit = await this.unitRepository.findOwnById(user.company?.id!, id);
    } else {
      unit = await this.unitRepository.findById(id);
    }

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    await this.unitRepository.softDelete(id);
  }
}
