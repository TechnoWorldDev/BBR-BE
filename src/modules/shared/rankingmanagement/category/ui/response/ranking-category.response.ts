import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { RankingCategoryTypeResponse } from '../../../categorytype/ui/response/ranking-category-type.response';
import { RankingCriteriaResponse } from '../../../criteria/ui/response/ranking-criteria.response';
import { TotalScoreHistoryResponse } from './total-score-history.response';

export class RankingCategoryResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly title: string,
    public readonly description: string,
    public readonly rankingCategoryType: RankingCategoryTypeResponse | null,
    public readonly rankingCriteria: RankingCriteriaResponse[] | [],
    public readonly residenceLimitation: number,
    public readonly rankingPrice: number,
    public readonly featuredImage: MediaResponse | null,
    public readonly status: string,
    public readonly entityId?: string,
    public readonly entity?: any,
    public readonly hasRequest?: Date,
    public readonly previousPosition?: number | null,
    public readonly previousTotalScore?: number | null
  ) {}
}
