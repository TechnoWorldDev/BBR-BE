import { CareerContactFormStatusEnum } from "../../domain/career-contact-form-status.enum";

export class UpdateCareerContactFormStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: CareerContactFormStatusEnum,
  ) {}
}
