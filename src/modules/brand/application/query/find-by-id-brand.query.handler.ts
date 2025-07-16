import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IBrandRepository } from '../../domain/brand.repository.interface';
import { Brand } from '../../domain/brand.entity';

@Injectable()
export class FindByIdBrandQueryHandler {
  constructor(private readonly brandRepository: IBrandRepository) {}

  @LogMethod()
  async handle(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }
}
