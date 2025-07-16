import { Injectable } from '@nestjs/common';
import { MatchmakingRecommendationResult } from '../domain/schema/matchmaking-recommendation-results.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MatchmakingRecommendationResultRepositoryImpl {
  constructor(
    @InjectModel(MatchmakingRecommendationResult.name)
    private readonly model: Model<MatchmakingRecommendationResult>
  ) {}

  async upsert(data: any) {
    // Prvo pročitaj prethodni dokument (ako postoji)
    const previous = await this.model.findOne({ sessionId: data.sessionId, userId: data.userId });

    // Spoji aiCriteria ako već postoji
    let mergedAiCriteria = data.aiCriteria;
    if (previous && previous.aiCriteria) {
      mergedAiCriteria = {
        ...previous.aiCriteria,
        ...data.aiCriteria, // novo gazi staro ako postoji isti key
      };
    }

    // Sastavi novi podatak
    const newData = {
      ...data,
      aiCriteria: mergedAiCriteria,
      updatedAt: new Date(),
    };

    // Upsert kao i do sad, ali sa merge-ovanim aiCriteria
    await this.model.findOneAndUpdate(
      { sessionId: data.sessionId, userId: data.userId },
      { $set: newData },
      { upsert: true, new: true }
    );
  }

  async findBySession(sessionId: string) {
    this.model.find({ sessionId }).lean().exec();
  }

  async findLastBySession(sessionId: string) {
    return this.model
      .findOne({ sessionId, aiCriteria: { $exists: true } })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
}
