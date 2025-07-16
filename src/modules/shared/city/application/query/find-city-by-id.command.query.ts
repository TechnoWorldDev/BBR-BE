import { Injectable, NotFoundException } from '@nestjs/common';
import { ICityRepository } from '../../domain/city.repository.interface';
import { City } from '../../domain/city.entity';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class FindCityByIdCommandQuery {
  constructor(private readonly cityRepository: ICityRepository) {}

  @LogMethod()
  async handle(id: string): Promise<City> {
    const city = await this.cityRepository.findById(id);
    if (!city) throw new NotFoundException('City not found');
    return city;
  }
}
