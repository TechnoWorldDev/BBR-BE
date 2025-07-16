import { Injectable, NotFoundException } from '@nestjs/common';
import { ICountryRepository } from '../../domain/country.repository.interface';
import { LogMethod } from '../../../../../shared/infrastructure/logger/log.decorator';

@Injectable()
export class DeleteCountryCommandHandler {
  constructor(private readonly countryRepository: ICountryRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const country = await this.countryRepository.findById(id);
    if (!country) throw new NotFoundException('Country not found');

    await this.countryRepository.delete(id);
  }
}
