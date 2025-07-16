export class UpdateCityCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly asciiName: string,
    public readonly countryId: string,
    public readonly population: number,
    public readonly timezone: string,
    public readonly xCoordinate: string,
    public readonly yCoordinate: string
  ) {}
}
