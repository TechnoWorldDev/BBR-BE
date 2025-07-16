import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'matchmaking_chat_messages', timestamps: true })
export class MatchmakingChatMessage extends Document {
  @Prop({ required: true }) sessionId: Types.ObjectId;
  @Prop({ required: true }) userId: string;
  @Prop({ required: true, enum: ['user', 'assistant', 'system'] }) role: string;
  @Prop({ required: true }) message: string;
  @Prop({ type: Object }) aiCriteria?: any; // Parsed AI criteria
  @Prop({ type: [String] }) responseResidenceIds?: string[]; // List of recommended residence ids if AI answered
  @Prop({ type: Date, default: Date.now }) timestamp: Date;
}

export const MatchmakingChatMessageSchema = SchemaFactory.createForClass(MatchmakingChatMessage);
