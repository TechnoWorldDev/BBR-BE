import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IUnitRepository } from '../../domain/unit.repository.interface';
import { Unit } from '../../domain/unit.entity';
import { IMediaService } from '../../../../../shared/media/media.service.interface';

@Injectable()
export class FindUnitBySlugCommandQuery {
  constructor(
    private readonly unitRepository: IUnitRepository,
    private readonly mediaService: IMediaService
  ) {}

  @LogMethod()
  async handle(slug: string): Promise<Unit> {
    const unit = await this.unitRepository.findBySlug(slug);
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    await this.mediaService.addTemporalUrls(unit.getAllImages());
    return unit;
  }
}
