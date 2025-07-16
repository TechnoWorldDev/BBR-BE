export class CreateCareerContactFormCommand {
  constructor(
    public readonly fullName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly linkedin: string | null,
    public readonly message: string,
    public readonly cvId: string | null,
    public readonly position: string,
    public readonly websiteURL: string
  ) {}
}
