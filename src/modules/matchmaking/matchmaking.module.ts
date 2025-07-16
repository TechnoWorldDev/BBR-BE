import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenAiService } from 'src/shared/openai/openai.service';
import { PromptService } from 'src/shared/openai/prompt/prompt.service';
import { CreateMMSessionCommandHandler } from './application/handler/create-mm-session.command.handler';
import { QueryMMCommandHandler } from './application/handler/query-mm.command.handler';
import { AiMatchmakingService } from './application/services/matchmaking-ai.service';
import { IMatchmakingRecommendationResultRepository } from './domain/matchmaking-recommendation-result.repository.interface';
import { IMatchmakingSessionsRepository } from './domain/matchmaking-sessions.repository.interface';
import { IResidenceRepository } from './domain/residence.repository.interface';
import {
  MatchmakingActivityLog,
  MatchmakingActivityLogSchema,
} from './domain/schema/matchmaking-activity-log.schema';
import {
  MatchmakingChatMessage,
  MatchmakingChatMessageSchema,
} from './domain/schema/matchmaking-chat-messages.schema';
import {
  MatchmakingRecommendationResult,
  MatchmakingRecommendationResultSchema,
} from './domain/schema/matchmaking-recommendation-results.schema';
import {
  MatchmakingSession,
  MatchmakingSessionSchema,
} from './domain/schema/matchmaking-sessions.schema';
import { MatchmakingRecommendationResultRepositoryImpl } from './infrastructure/matchmaking-recommendation-result.repository.impl';
import { MatchmakingSessionsRepositoryImpl } from './infrastructure/matchmaking-sessions.repository.impl';
import { ResidenceRepositoryImpl } from './infrastructure/residence.repository.impl';
import { MatchmakingController } from './ui/matchmaking.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatchmakingSession.name, schema: MatchmakingSessionSchema },
      { name: MatchmakingChatMessage.name, schema: MatchmakingChatMessageSchema },
      { name: MatchmakingRecommendationResult.name, schema: MatchmakingRecommendationResultSchema },
      { name: MatchmakingActivityLog.name, schema: MatchmakingActivityLogSchema },
    ]),
  ],
  controllers: [MatchmakingController],
  providers: [
    {
      provide: IMatchmakingSessionsRepository,
      useClass: MatchmakingSessionsRepositoryImpl,
    },
    {
      provide: IMatchmakingRecommendationResultRepository,
      useClass: MatchmakingRecommendationResultRepositoryImpl,
    },
    {
      provide: IResidenceRepository,
      useClass: ResidenceRepositoryImpl,
    },
    CreateMMSessionCommandHandler,
    QueryMMCommandHandler,
    AiMatchmakingService,
    PromptService,
    OpenAiService,
  ],
})
export class MatchmakingModule {}
