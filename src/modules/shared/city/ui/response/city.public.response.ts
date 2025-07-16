import { CountryResponse } from './country.response';

export class CityPublicResponse {
  constructor(
    public id: string,
    public name: string,
    public asciiName: string,
    public country: CountryResponse,
    public population: number,
    public timezone: string,
    public xCoordinate: string,
    public yCoordinate: string
  ) {}
}
