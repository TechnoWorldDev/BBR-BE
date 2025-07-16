import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'matchmaking_sessions', timestamps: true })
export class MatchmakingSession extends Document {
  @Prop({ required: true }) userId: string;
  @Prop({ default: 'active' }) status: string; // active | completed | aborted
  @Prop({ type: Date, default: Date.now }) startedAt: Date;
  @Prop() endedAt?: Date;
  @Prop({ type: Object }) metadata?: any; // ip, userAgent, etc.
}

export const MatchmakingSessionSchema = SchemaFactory.createForClass(MatchmakingSession);
