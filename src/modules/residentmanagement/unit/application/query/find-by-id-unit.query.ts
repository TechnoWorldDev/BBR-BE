import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IUnitRepository } from '../../domain/unit.repository.interface';
import { Unit } from '../../domain/unit.entity';
import { IMediaService } from '../../../../../shared/media/media.service.interface';

@Injectable()
export class FindUnitByIdCommandQuery {
  constructor(
    private readonly unitRepository: IUnitRepository,
    private readonly mediaService:IMediaService
  ) {}

  @LogMethod()
  async handle(id: string): Promise<Unit> {
    const unit = await this.unitRepository.findById(id);
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    await this.mediaService.addTemporalUrls(unit.getAllImages());
    return unit;
  }
}
