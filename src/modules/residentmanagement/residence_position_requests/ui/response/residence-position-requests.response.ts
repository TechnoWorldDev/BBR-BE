import { RankingCategoryResponse } from './ranking-category.response';
import { ResidenceResponse } from './residence.response';
import { UserResponse } from './user.response';

export class ResidencePositionRequestResponse {
  constructor(
    public readonly id: string,
    public readonly residence: ResidenceResponse | null,
    public readonly rankingCategory: RankingCategoryResponse | null,
    public readonly requestedPosition: number,
    public readonly requestedByUser: UserResponse | null,
    public readonly requestedAt: Date,
    public readonly status: string,
    public readonly reviewedByUser?: UserResponse | null,
    public readonly reviewedAt?: Date,
    public readonly reviewNotes?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
