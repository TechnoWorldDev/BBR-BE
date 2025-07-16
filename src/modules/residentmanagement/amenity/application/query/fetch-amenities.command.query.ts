import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchAmenitiesQuery } from '../commands/fetch-amenities.query';
import { Amenity } from '../../domain/amenity.entity';
import { IAmenityRepository } from '../../domain/amenity.repository.interface';

@Injectable()
export class FetchAmenitiesCommandQuery {
  constructor(private readonly amenityRepository: IAmenityRepository) {}

  @LogMethod()
  async handler(
    query: FetchAmenitiesQuery
  ): Promise<{ data: Amenity[]; pagination: PaginationResponse }> {
    const result = await this.amenityRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
