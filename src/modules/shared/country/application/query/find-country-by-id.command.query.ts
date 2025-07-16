import { Injectable, NotFoundException } from '@nestjs/common';
import { ICountryRepository } from '../../domain/country.repository.interface';
import { Country } from '../../domain/country.entity';
import { LogMethod } from '../../../../../shared/infrastructure/logger/log.decorator';

@Injectable()
export class FindCountryByIdCommandQuery {
  constructor(private readonly countryRepository: ICountryRepository) {}

  @LogMethod()
  async handle(id: string): Promise<Country> {
    const country = await this.countryRepository.findById(id);
    if (!country) throw new NotFoundException('Country not found');
    return country;
  }
}
