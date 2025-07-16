import { PhoneCode } from '../../domain/phone-code.entity';
import { PhoneCodeResponse } from '../response/phone-code.response';
import { CountryResponse } from '../response/country.response';

export class PhoneCodeMapper {
  static mapToResponse(phoneCode: PhoneCode): PhoneCodeResponse {
    const country = phoneCode.country
      ? new CountryResponse(
          phoneCode.country.id,
          phoneCode.country.name,
          phoneCode.country.flag
        )
      : null;

    return new PhoneCodeResponse(
      phoneCode.id,
      phoneCode.code,
      country,
      phoneCode.createdAt,
      phoneCode.updatedAt
    );
  }
}
