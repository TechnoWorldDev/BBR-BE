import { Country } from '../../domain/country.entity';
import { CountryResponse } from '../response/country.response';
import { ContinentResponse } from '../../../continent/ui/response/continent.response';
import { PhoneCode } from '../../../phone_code/domain/phone-code.entity';
import { PhoneCodeResponse } from '../../../phone_code/ui/response/phone-code.response';
import { CountryPublicResponse } from '../response/country.public.response';


export class CountryMapper {
  static mapToResponse(country: Country): CountryResponse {
    return new CountryResponse(
      country.id,
      country.name,
      country.code,
      country.tld,
      country.currencyCode,
      country.currencyName,
      country.currencySymbol,
      country.capital,
      country.phoneCodes !== null
        ? country.phoneCodes.map((phoneCode) => this.mapToPhoneCodeResponse(phoneCode))
        : [],
      country.subregion,
      country.flag,
      country.continent !== null
        ? new ContinentResponse(
          country.continent.id,
          country.continent.name,
          country.continent.code,
          country.continent.createdAt,
          country.continent.updatedAt
        )
        : null,
      country.createdAt,
      country.updatedAt
    );
  }

  static mapToPublicResponse(country: Country): CountryPublicResponse {
    return new CountryPublicResponse(
      country.id,
      country.name,
      country.code,
      country.tld,
      country.currencyCode,
      country.currencyName,
      country.currencySymbol,
      country.capital,
      country.phoneCodes !== null
        ? country.phoneCodes.map((phoneCode) => this.mapToPhoneCodeResponse(phoneCode))
        : [],
      country.subregion,
      country.flag,
      country.continent !== null
        ? new ContinentResponse(
          country.continent.id,
          country.continent.name,
          country.continent.code,
          country.continent.createdAt,
          country.continent.updatedAt
        )
        : null,
    );
  }

  static mapToPhoneCodeResponse(phoneCode: PhoneCode): PhoneCodeResponse {
    return new PhoneCodeResponse(
      phoneCode.id,
      phoneCode.code,
      phoneCode.country,
      phoneCode.createdAt,
      phoneCode.updatedAt
    );
  }
}
