import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandType } from '../../domain/brand-type.entity';
import { IBrandTypesRepository } from '../../domain/brand-type.repository.interface';
import { FindByIdBrandTypeQuery } from '../command/find-by-id-brand-type.query';

@Injectable()
export class FindByIdBrandTypeQueryHandler {
  constructor(private readonly brandTypesRepository: IBrandTypesRepository) {}

  async handle(command: FindByIdBrandTypeQuery): Promise<BrandType> {
    const brandType = await this.brandTypesRepository.findById(command.id);

    if (!brandType) {
      throw new NotFoundException('Brand type not found');
    }

    return brandType;
  }
}
