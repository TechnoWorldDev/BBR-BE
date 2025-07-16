import { Injectable } from '@nestjs/common';
import { IMatchmakingSessionsRepository } from '../domain/matchmaking-sessions.repository.interface';
import { MatchmakingSession } from '../domain/schema/matchmaking-sessions.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MatchmakingSessionsRepositoryImpl implements IMatchmakingSessionsRepository {
  constructor(
    @InjectModel(MatchmakingSession.name)
    private readonly sessionModel: Model<MatchmakingSession>
  ) {}

  async create(session: Partial<MatchmakingSession>): Promise<MatchmakingSession> {
    return this.sessionModel.create(session);
  }
}
