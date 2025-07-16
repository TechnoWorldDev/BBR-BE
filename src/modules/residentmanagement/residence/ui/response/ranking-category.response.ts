import { MediaResponse } from 'src/modules/media/ui/response/media.response';

export class RankingCategoryResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly title: string,
    public readonly description: string,
    public readonly featuredImage: MediaResponse | null
  ) {}
}
