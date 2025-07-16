import { CountryResponse } from './country.response';

export class PhoneCodeResponse {
  constructor(
    public id: string,
    public code: string,
    public country: CountryResponse | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
