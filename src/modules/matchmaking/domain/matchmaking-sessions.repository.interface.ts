import { MatchmakingSession } from './schema/matchmaking-sessions.schema';

export abstract class IMatchmakingSessionsRepository {
  abstract create(session: Partial<MatchmakingSession>): Promise<MatchmakingSession>;
}
