import { MediaResponse } from 'src/modules/media/ui/response/media.response';

export class ContactFormResponse {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly link: string,
    public readonly description: string,
    public readonly attachment: MediaResponse | null,
    public readonly type:string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
