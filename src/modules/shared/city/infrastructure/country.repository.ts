import { Injectable } from '@nestjs/common';
import { ICountryRepository } from '../domain/country.repository.interface';
import { LogMethod } from '../../../../shared/infrastructure/logger/log.decorator';
import { Country } from '../domain/country.entity';

@Injectable()
export class CountryRepositoryImpl implements ICountryRepository {
  @LogMethod()
  async findById(id: string): Promise<Country | undefined> {
    return Country.query().findById(id).whereNull('deleted_at');
  }
}
