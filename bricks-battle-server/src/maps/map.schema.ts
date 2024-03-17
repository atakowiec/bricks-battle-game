import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MapType } from '@shared/Map';

export type MapDocument = HydratedDocument<Map>;

@Schema()
export class Map extends Model {
  @Prop()
  type: MapType;

  @Prop()
  name: string;

  @Prop()
  ownerId?: string;

  @Prop()
  size: number;

  @Prop()
  data: string;
}

export const MapSchema = SchemaFactory.createForClass(Map);
