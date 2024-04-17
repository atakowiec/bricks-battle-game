import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../users/user.schema';
import { Gadget } from './gadget.schema';
import { GadgetType } from '@shared/Gadgets';

export type SelectedGadgetDocument = HydratedDocument<SelectedGadget>;

@Schema()
export class SelectedGadget extends Model {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Gadget' })
  gadget: Gadget;

  @Prop()
  gadgetType: GadgetType;
}

export const SelectedGadgetSchema = SchemaFactory.createForClass(SelectedGadget);
