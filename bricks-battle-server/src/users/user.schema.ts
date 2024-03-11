import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Model {
  @Prop()
  nickname: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
