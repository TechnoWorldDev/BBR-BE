import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { RankingCategoryTypePublicResponse } from '../../../categorytype/ui/response/ranking-category-type.public.response';

export class RankingCategoryPublicResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly title: string,
    public readonly description: string,
    public readonly rankingCategoryType: RankingCategoryTypePublicResponse | null,
    public readonly featuredImage: MediaResponse | null,
    public readonly residenceLimitation: number,
    public readonly entityId?: string,
    public readonly entity?: any
  ) {}
}
