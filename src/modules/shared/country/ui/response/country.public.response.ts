import { PhoneCodeResponse } from 'src/modules/shared/phone_code/ui/response/phone-code.response';
import { ContinentResponse } from '../../../continent/ui/response/continent.response';

export class CountryPublicResponse {
  id: string;
  name: string;
  code: string;
  tld: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  capital: string;
  phoneCodes: PhoneCodeResponse[];
  subregion: string;
  flag: string;
  continent: ContinentResponse | null;

  constructor(
    id: string,
    name: string,
    code: string,
    tld: string,
    currencyCode: string,
    currencyName: string,
    currencySymbol: string,
    capital: string,
    phoneCodes: PhoneCodeResponse[],
    subregion: string,
    flag: string,
    continent: ContinentResponse | null,
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.tld = tld;
    this.currencyCode = currencyCode;
    this.currencyName = currencyName;
    this.currencySymbol = currencySymbol;
    this.capital = capital;
    this.phoneCodes = phoneCodes;
    this.subregion = subregion;
    this.flag = flag;
    this.continent = continent;
  }
}
