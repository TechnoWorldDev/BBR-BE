import { MediaResponse } from 'src/modules/media/ui/response/media.response';

export class ResidenceResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string
  ) {}
}
