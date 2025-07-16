import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCountryCommand } from '../commands/update-country.command';
import { Country } from '../../domain/country.entity';
import { ICountryRepository } from '../../domain/country.repository.interface';
import { LogMethod } from '../../../../../shared/infrastructure/logger/log.decorator';
import { IContinentRepository } from '../../../continent/domain/continent.repository.interface';
import { IMediaRepository } from '../../../../media/domain/media.repository.interface';
import { IPhoneCodeRepository } from 'src/modules/shared/phone_code/domain/phone-code.repository.interface';

@Injectable()
export class UpdateCountryCommandHandler {
  constructor(
    private readonly countryRepository: ICountryRepository,
    private readonly continentRepository: IContinentRepository,
    private readonly phoneCodeRepository: IPhoneCodeRepository
  ) {}

  @LogMethod()
  async handle(command: UpdateCountryCommand): Promise<Country> {
    const existingCountry = await this.countryRepository.findById(command.id);
    if (!existingCountry) {
      throw new NotFoundException('Country not found');
    }

    const existingCountryByName = await this.countryRepository.findByName(command.name ?? '');
    if (existingCountryByName && existingCountryByName.id !== command.id) {
      throw new ConflictException('Country with this name already exists');
    }

    const continent = await this.continentRepository.findById(command.continentId);
    if (!continent) {
      throw new NotFoundException('Continent not found');
    }

    const phoneCodes = await this.phoneCodeRepository.createOrUpdatePhoneCodesForCountry(
      command.phoneCodes,
      existingCountry.id
    );
    if (phoneCodes.length !== command.phoneCodes.length) {
      throw new NotFoundException('One or more phone codes not found');
    }

    const updatedCountry = await this.countryRepository.update(command.id, {
      name: command.name,
      code: command.code,
      tld: command.tld,
      currencyCode: command.currencyCode,
      currencyName: command.currencyName,
      currencySymbol: command.currencySymbol,
      capital: command.capital,
      phoneCodes: phoneCodes,
      subregion: command.subregion,
      flag: command.flag,
      continent: continent,
    });

    if (!updatedCountry) {
      throw new InternalServerErrorException('Country not updated');
    }

    return updatedCountry;
  }
}
