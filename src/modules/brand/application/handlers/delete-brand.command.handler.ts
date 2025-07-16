import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IBrandRepository } from '../../domain/brand.repository.interface';

@Injectable()
export class DeleteBrandCommandHandler {
  constructor(private readonly brandRepository: IBrandRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const existingBrand = await this.brandRepository.findById(id);
    if (!existingBrand) {
      throw new NotFoundException('Brand not found');
    }

    await this.brandRepository.delete(id);
  }
}
