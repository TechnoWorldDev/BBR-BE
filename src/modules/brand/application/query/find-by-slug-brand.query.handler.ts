import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IBrandRepository } from '../../domain/brand.repository.interface';
import { Brand } from '../../domain/brand.entity';

@Injectable()
export class FindBySlugBrandQueryHandler {
  constructor(private readonly brandRepository: IBrandRepository) {}

  @LogMethod()
  async handle(slug: string): Promise<Brand> {
    const brand = await this.brandRepository.findBySlug(slug);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }
}
