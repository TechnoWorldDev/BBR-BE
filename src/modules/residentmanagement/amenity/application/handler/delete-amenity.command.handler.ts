import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from '../../../../../shared/infrastructure/logger/log.decorator';
import { IAmenityRepository } from '../../domain/amenity.repository.interface';

@Injectable()
export class DeleteAmenityCommandHandler {
  constructor(private readonly amenityRepository: IAmenityRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const amenity = await this.amenityRepository.findById(id);
    if (!amenity) throw new NotFoundException('Amenity not found');

    await this.amenityRepository.delete(id);
  }
}
