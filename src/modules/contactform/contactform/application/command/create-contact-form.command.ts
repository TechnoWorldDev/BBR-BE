import { ContactFormType } from "../../domain/contact-form-type.enum";

export class CreateContactFormCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly link: string,
    public readonly description: string,
    public readonly attachmentId: string,
    public readonly type: ContactFormType, 
  ) {}
}
