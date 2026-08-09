import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ index: true, sparse: true })
  googleId?: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ index: true, sparse: true, lowercase: true, trim: true })
  email?: string;

  @Prop()
  avatar?: string;

  @Prop({ default: false, index: true })
  isGuest: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

