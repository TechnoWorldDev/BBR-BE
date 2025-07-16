import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ICityRepository } from '../../domain/city.repository.interface';
import { ICountryRepository } from '../../domain/country.repository.interface';
import { City } from '../../domain/city.entity';
import { UpdateCityCommand } from '../commands/update-city.command';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class UpdateCityCommandHandler {
  constructor(
    private readonly cityRepository: ICityRepository,
    private readonly countryRepository: ICountryRepository
  ) {}

  @LogMethod()
  async handle(command: UpdateCityCommand): Promise<City> {
    const existingCity = await this.cityRepository.findById(command.id);
    if (!existingCity) {
      throw new NotFoundException('City not found');
    }

    const country = await this.countryRepository.findById(command.countryId);
    if (!country) {
      throw new NotFoundException('Country not found');
    }

    const existingCityByName = await this.cityRepository.findByName(command.name ?? '');
    if (
      existingCityByName &&
      existingCityByName.id !== command.id &&
      existingCityByName.countryId === country.id
    ) {
      throw new ConflictException('City with this name already exists');
    }

    const updatedCity = await this.cityRepository.update(command.id, {
      name: command.name,
      asciiName: command.asciiName,
      population: command.population,
      timezone: command.timezone,
      xCoordinate: command.xCoordinate,
      yCoordinate: command.yCoordinate,
      country: country,
    });

    if (!updatedCity) {
      throw new InternalServerErrorException('City not updated');
    }

    return updatedCity;
  }
}
