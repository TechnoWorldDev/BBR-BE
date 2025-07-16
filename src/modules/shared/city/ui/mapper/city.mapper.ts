import { City } from '../../domain/city.entity';
import { CityResponse } from '../response/city.response';
import { Country } from '../../domain/country.entity';
import { CountryResponse } from '../response/country.response';
import { CityPublicResponse } from '../response/city.public.response';


export class CityMapper {

  static mapToResponse(city: City): CityResponse {
    return new CityResponse(
      city.id,
      city.name,
      city.asciiName,
      this.mapToCountryResponse(city.country),
      city.population,
      city.timezone,
      city.yCoordinate,
      city.xCoordinate,
      city.createdAt,
      city.updatedAt
    );
  }

  static mapToPublicResponse(city: City): CityPublicResponse {
    return new CityPublicResponse(
      city.id,
      city.name,
      city.asciiName,
      this.mapToCountryResponse(city.country),
      city.population,
      city.timezone,
      city.yCoordinate,
      city.xCoordinate
    );
  }

  static mapToCountryResponse(country: Country): CountryResponse {
    return new CountryResponse(country.id, country.name, country.code);
  }
}
