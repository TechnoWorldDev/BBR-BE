import { MediaResponse } from 'src/modules/media/ui/response/media.response';

export class CareerContactFormResponse {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly linkedin: string | null,
    public readonly message: string,
    public readonly cv: MediaResponse | null,
    public readonly position: string,
    public readonly websiteURL: string,
    public readonly status: string ,
    public readonly note: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
