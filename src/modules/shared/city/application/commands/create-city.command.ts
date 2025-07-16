export class CreateCityCommand {
  constructor(
    public readonly name: string,
    public readonly asciiName: string,
    public readonly countryId: string,
    public readonly population: number,
    public readonly timezone: string,
    public readonly xCoordinate: string,
    public readonly yCoordinate: string
  ) {}
}
