import { CountryResponse } from './country.response';

export class CityResponse {
  constructor(
    public id: string,
    public name: string,
    public asciiName: string,
    public country: CountryResponse,
    public population: number,
    public timezone: string,
    public xCoordinate: string,
    public yCoordinate: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
