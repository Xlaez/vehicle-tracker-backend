import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '../../user';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: true })
export class Token {
  @Prop({ type: String, required: true, index: true })
  token: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: string;

  @Prop({ type: String, enum: ['refresh', 'access'], default: 'refresh' })
  type: string;

  @Prop({ type: String, required: true })
  expires: string;

  @Prop({ type: Boolean, default: false })
  blacklisted: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
