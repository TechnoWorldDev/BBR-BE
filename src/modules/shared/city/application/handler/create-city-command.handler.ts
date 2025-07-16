import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ICountryRepository } from '../../domain/country.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { CreateCityCommand } from '../commands/create-city.command';
import { City } from '../../domain/city.entity';
import { ICityRepository } from '../../domain/city.repository.interface';

@Injectable()
export class CreateCityCommandHandler {
  constructor(
    private readonly cityRepository: ICityRepository,
    private readonly countryRepository: ICountryRepository
  ) {}

  @LogMethod()
  async handle(command: CreateCityCommand): Promise<City> {
    const country = await this.countryRepository.findById(command.countryId);
    if (!country) {
      throw new NotFoundException('Country not found');
    }

    const existingCity = await this.cityRepository.findByName(command.name);
    if (existingCity && existingCity.countryId === country.id) {
      throw new ConflictException('City with this name already exists in this country');
    }

    const city = await this.cityRepository.create({
      name: command.name,
      asciiName: command.asciiName,
      population: command.population,
      timezone: command.timezone,
      xCoordinate: command.xCoordinate,
      yCoordinate: command.yCoordinate,
      country: country,
    });

    if (!city) {
      throw new InternalServerErrorException('City not saved.');
    }

    return city;
  }
}
