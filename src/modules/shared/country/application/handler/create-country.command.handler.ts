import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ICountryRepository } from '../../domain/country.repository.interface';
import { CreateCountryCommand } from '../commands/create-country.command';
import { Country } from '../../domain/country.entity';
import { LogMethod } from '../../../../../shared/infrastructure/logger/log.decorator';
import { IContinentRepository } from '../../../continent/domain/continent.repository.interface';
import { IMediaRepository } from '../../../../media/domain/media.repository.interface';
import { IPhoneCodeRepository } from 'src/modules/shared/phone_code/domain/phone-code.repository.interface';

@Injectable()
export class CreateCountryCommandHandler {
  constructor(
    private readonly countryRepository: ICountryRepository,
    private readonly continentRepository: IContinentRepository,
    private readonly phoneCodeRepository: IPhoneCodeRepository
  ) {}

  @LogMethod()
  async handle(command: CreateCountryCommand): Promise<Country> {
    const existingCountry = await this.countryRepository.findByName(command.name);
    if (existingCountry) {
      throw new ConflictException('Country with this name already exists');
    }

    const continent = await this.continentRepository.findById(command.continentId);
    if (!continent) {
      throw new NotFoundException('Continent not found');
    }

    const result = await this.countryRepository.create({
      name: command.name,
      code: command.code,
      tld: command.tld,
      currencyCode: command.currencyCode,
      currencyName: command.currencyName,
      currencySymbol: command.currencySymbol,
      capital: command.capital,
      subregion: command.subregion,
      flag: command.flag,
      continent: continent,
    });

    if (!result) {
      throw new InternalServerErrorException('Country not saved.');
    }

    const phoneCodes = await this.phoneCodeRepository.createOrUpdatePhoneCodesForCountry(
      command.phoneCodes,
      result.id
    );
    if (phoneCodes.length !== command.phoneCodes.length) {
      throw new NotFoundException('One or more phone codes not found');
    }

    result.phoneCodes = phoneCodes;

    return result;
  }
}
