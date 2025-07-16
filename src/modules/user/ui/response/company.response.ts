import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { PlanResponse } from './plan.response';

export class CompanyResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly address?: string,
    public readonly image?: MediaResponse | null,
    public readonly phoneNumber?: string,
    public readonly phoneNumberCountryCode?: string,
    public readonly website?: string,
    public readonly contactPersonAvatar?: MediaResponse | null,
    public readonly contactPersonFullName?: string,
    public readonly contactPersonJobTitle?: string,
    public readonly contactPersonEmail?: string,
    public readonly contactPersonPhoneNumber?: string,
    public readonly contactPersonPhoneNumberCountryCode?: string,
    public readonly plan?: PlanResponse | null
  ) {}
}
