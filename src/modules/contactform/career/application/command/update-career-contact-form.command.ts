import { CareerContactFormStatusEnum } from "../../domain/career-contact-form-status.enum";

export class UpdateCareerContactFormCommand {
  constructor(
    public readonly id: string,
    public readonly status: CareerContactFormStatusEnum,
    public readonly note: string,
  ) {}
}
