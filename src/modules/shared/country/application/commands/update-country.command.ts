export class UpdateCountryCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly tld: string,
    public readonly currencyCode: string,
    public readonly currencyName: string,
    public readonly currencySymbol: string,
    public readonly capital: string,
    public readonly phoneCodes: string[],
    public readonly subregion: string,
    public readonly flag: string,
    public readonly continentId: string
  ) {}
}
