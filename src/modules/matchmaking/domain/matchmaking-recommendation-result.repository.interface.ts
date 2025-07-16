import { MatchmakingRecommendationResult } from './schema/matchmaking-recommendation-results.schema';

export abstract class IMatchmakingRecommendationResultRepository {
  abstract upsert(recommendationResult: Partial<MatchmakingRecommendationResult>): Promise<any>;
  abstract findBySession(sessionId: string): Promise<any>;
  abstract findLastBySession(sessionId: string): Promise<any>;
}
