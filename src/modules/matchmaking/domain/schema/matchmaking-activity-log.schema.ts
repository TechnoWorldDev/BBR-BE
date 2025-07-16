import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'matchmaking_activity_log', timestamps: true })
export class MatchmakingActivityLog extends Document {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) sessionId: Types.ObjectId;
  @Prop({ required: true }) type: string; // QUERY | AI_RESPONSE | SESSION_START | SESSION_END | ERROR | ...
  @Prop() detail?: string; // Short message or description
  @Prop({ type: Object }) payload?: any; // Optional full object payload
  @Prop({ type: Date, default: Date.now }) timestamp: Date;
}

export const MatchmakingActivityLogSchema = SchemaFactory.createForClass(MatchmakingActivityLog);
