import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DisplayType, GadgetType } from '@shared/Gadgets';

export type GadgetDocument = HydratedDocument<Gadget>;

@Schema()
export class Gadget extends Model {
  @Prop()
  type: GadgetType;

  @Prop()
  data: string;

  @Prop()
  displayType: DisplayType;
}

export const GadgetSchema = SchemaFactory.createForClass(Gadget);
