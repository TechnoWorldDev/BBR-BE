import { MediaResponse } from 'src/modules/media/ui/response/media.response';

export class CompanyResponse {
  constructor(
    public readonly id: string,
    public readonly name: string
  ) {}
}
