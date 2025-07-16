export class UpdateContactFormCommand {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly link: string,
    public readonly description: string,
    public readonly attachmentId: string
  ) {}
}
