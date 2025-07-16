export class UpdateCompanyProfileCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly address?: string,
    public readonly imageId?: string,
    public readonly phoneNumber?: string,
    public readonly phoneNumberCountryCode?: string,
    public readonly website?: string,
    public readonly contactPersonAvatarId?: string,
    public readonly contactPersonFullName?: string,
    public readonly contactPersonJobTitle?: string,
    public readonly contactPersonEmail?: string,
    public readonly contactPersonPhoneNumber?: string,
    public readonly contactPersonPhoneNumberCountryCode?: string
  ) {}
}
