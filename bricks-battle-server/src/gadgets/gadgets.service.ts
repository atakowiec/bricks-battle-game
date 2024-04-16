import { Injectable } from '@nestjs/common';
import { GadgetType } from '@shared/Gadgets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gadget } from './gadget.schema';
import { CreateGadgetDto } from './create-gadget.dto';

@Injectable()
export class GadgetsService {
  constructor(@InjectModel(Gadget.name) private gadgetModel: Model<Gadget>) {
    // empty

  }

  getAllGadgetsByType(type: GadgetType) {
    return this.gadgetModel.find({ type }).sort({ displayType: 1 });
  }

  createGadget(createGadgetDto: CreateGadgetDto) {
    const gadget = new this.gadgetModel(createGadgetDto);
    return gadget.save();
  }

  deleteGadget(id: string) {
    return this.gadgetModel.deleteOne({ _id: id });
  }
}
