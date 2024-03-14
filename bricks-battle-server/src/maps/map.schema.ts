import { HydratedDocument, Model, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MapType } from '@shared/Map';

export type MapDocument = HydratedDocument<Map>;

@Schema()
export class Map extends Model {
  @Prop()
  _id: ObjectId;

  @Prop()
  type: MapType;

  @Prop()
  name: string;

  @Prop()
  ownerId?: string;

  @Prop()
  width: number;

  @Prop()
  data: string;
}

export const MapSchema = SchemaFactory.createForClass(Map);
