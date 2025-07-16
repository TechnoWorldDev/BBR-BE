import { Injectable, NotFoundException } from '@nestjs/common';
import { Amenity } from '../../domain/amenity.entity';
import { LogMethod } from '../../../../../shared/infrastructure/logger/log.decorator';
import { IAmenityRepository } from '../../domain/amenity.repository.interface';

@Injectable()
export class FindAmenityByIdCommandQuery {
  constructor(private readonly amenityRepository: IAmenityRepository) {}

  @LogMethod()
  async handle(id: string): Promise<Amenity> {
    const amenity = await this.amenityRepository.findById(id);
    if (!amenity) throw new NotFoundException('Amenity not found');
    return amenity;
  }
}
