import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MapType } from '@shared/Map';
import { User } from '../users/user.schema';

export type MapDocument = HydratedDocument<Map>;

@Schema()
export class Map extends Model {
  @Prop()
  type: MapType;

  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner?: User;

  @Prop()
  size: number;

  @Prop()
  data: string;

  @Prop()
  difficulty: string;
}

export const MapSchema = SchemaFactory.createForClass(Map);
