import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'matchmaking_recommendation_results', timestamps: true })
export class MatchmakingRecommendationResult extends Document {
  @Prop({ required: true }) sessionId: Types.ObjectId;
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) inputMessage: string;
  @Prop({ type: Object }) aiCriteria?: any;
  @Prop({ type: Array }) recommendedResidences: Array<{
    id: string;
    score?: number;
    reason?: string;
    [key: string]: any;
  }>;
  @Prop() rawAiPrompt?: string;
  @Prop() rawAiResponse?: string;
  @Prop({ type: Date, default: Date.now }) createdAt: Date;
  @Prop({ type: Date, default: Date.now }) updatedAt: Date;
}

export const MatchmakingRecommendationResultSchema = SchemaFactory.createForClass(
  MatchmakingRecommendationResult
);
