import { Injectable } from '@nestjs/common';
import { IMatchmakingRecommendationResultRepository } from '../../domain/matchmaking-recommendation-result.repository.interface';
import { AiMatchmakingService } from '../services/matchmaking-ai.service';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { Types } from 'mongoose';

@Injectable()
export class QueryMMCommandHandler {
  constructor(
    private readonly matchmakingRecommendationResultRepository: IMatchmakingRecommendationResultRepository,
    private readonly aiMatchmakingService: AiMatchmakingService,
    private readonly residenceRepository: IResidenceRepository
  ) {}

  async handle(command: any) {
    const previousRecommendation =
      await this.matchmakingRecommendationResultRepository.findLastBySession(command.sessionId);

    const previousCriteria = previousRecommendation?.aiCriteria || {};
    const userMessage = command.userMessage;
    const maxResults = 10;

    const {
      friendlyResponse,
      criteria: baseCriteria,
      rawAiPrompt,
      rawAiResponse,
    } = await this.aiMatchmakingService.progressiveFillCombined(previousCriteria, userMessage);

    let results = await this.residenceRepository.findByCriteria(baseCriteria);
    let relaxed = false;
    let relaxedFields: string[] = [];

    if (!results.length) {
      // Progressive relaxation
      const relaxOrder: string[] = [
        'budgetEndRange',
        'budgetStartRange',
        'highlightedAmenities',
        'amenities',
        'keyFeatures',
        'petFriendly',
      ];
      let criteria: Record<string, any> = { ...baseCriteria };

      for (const field of relaxOrder) {
        if (results.length >= maxResults) break;

        if (field in criteria) {
          delete criteria[field];
          relaxedFields.push(field);
          results = await this.residenceRepository.findByCriteria(criteria);
          if (results.length > 0) {
            relaxed = true;
            break;
          }
        }
      }

      // Fallback: bez ijednog filtera
      if (!results.length) {
        results = await this.residenceRepository.findByCriteria({});
        relaxed = true;
        relaxedFields = Object.keys(baseCriteria);
      }
    }

    await this.saveRecommendationResult({
      sessionId: command.sessionId,
      userId: command.userId,
      inputMessage: userMessage,
      aiCriteria: baseCriteria,
      recommendedResidences: results,
      rawAiPrompt: rawAiPrompt,
      rawAiResponse: rawAiResponse,
      relaxed,
      relaxedFields,
    });

    return {
      friendlyResponse,
      residences: results,
      relaxed,
      relaxedFields,
    };
    // updatedCriteria koristiš direktno za filtriranje u bazi (Postgres/Knex/Objection)
  }

  async saveRecommendationResult(params: {
    sessionId: string;
    userId: string;
    inputMessage: string;
    aiCriteria: any;
    recommendedResidences: any[];
    rawAiPrompt?: string;
    rawAiResponse?: string;
    relaxed?: boolean;
    relaxedFields?: string[];
  }) {
    await this.matchmakingRecommendationResultRepository.upsert({
      sessionId: new Types.ObjectId(params.sessionId),
      userId: params.userId,
      inputMessage: params.inputMessage,
      aiCriteria: params.aiCriteria,
      recommendedResidences: params.recommendedResidences.map((r) => ({
        id: r.id,
        score: r.score,
        featuredImage: r.featuredImage,
        name: r.name,
        description: r.description,
        slug: r.slug,
      })),
      rawAiPrompt: params.rawAiPrompt,
      rawAiResponse: params.rawAiResponse,
      updatedAt: new Date(),
      ...(params.relaxed !== undefined && { relaxed: params.relaxed }),
      ...(params.relaxedFields && { relaxedFields: params.relaxedFields }),
    });
  }
}
