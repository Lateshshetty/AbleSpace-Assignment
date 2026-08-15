import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type ProjectInviteDocument = HydratedDocument<ProjectInvite>;

@Schema({ timestamps: true })
export class ProjectInvite {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true, index: true })
  projectId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  invitedBy: Types.ObjectId;

  @Prop({ required: true, trim: true, lowercase: true, index: true })
  email: string;

  @Prop({ required: true, unique: true, index: true })
  token: string;

  @Prop({ enum: ['pending', 'accepted'], default: 'pending', index: true })
  status: 'pending' | 'accepted';

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  acceptedAt?: Date;
}

export const ProjectInviteSchema = SchemaFactory.createForClass(ProjectInvite);

