import { MediaResponse } from '../../../../media/ui/response/media.response';

export class AmenityResponse {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public icon: MediaResponse | null,
    public featuredImage: MediaResponse | null,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt?: Date
  ) {}
}
