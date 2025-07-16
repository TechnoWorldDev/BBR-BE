import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { PhoneCodeResponse } from '../../../../shared/phone_code/ui/response/phone-code.response';
import { ResidenceResponse } from './residence.response';
import { UserResponse } from './user.response';

export class ClaimProfileContactFormResponse {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly phoneCode: PhoneCodeResponse | null,
    public readonly websiteUrl: string,
    public readonly cv: MediaResponse | null,
    public readonly status: string,
    public readonly residence: ResidenceResponse | null,
    public readonly createdBy: UserResponse | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
