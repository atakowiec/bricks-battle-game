import { ForbiddenException, Injectable } from '@nestjs/common';
import { GadgetType, IGadget } from '@shared/Gadgets';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Gadget } from './gadget.schema';
import { CreateGadgetDto } from './create-gadget.dto';
import { SelectedGadget } from './selected-gadgets.schema';
import { TokenPayload } from '../types/request.type';

@Injectable()
export class GadgetsService {
  constructor(@InjectModel(Gadget.name) private gadgetModel: Model<Gadget>,
              @InjectModel(SelectedGadget.name) private selectedGadgetModel: Model<SelectedGadget>,
  ) {
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

  async getSelectedGadgets(userId: mongoose.Types.ObjectId) {
    const result = await this.selectedGadgetModel.find({ user: userId }).populate('gadget').exec();
    return result.reduce((acc, selectedGadget) => {
      acc[selectedGadget.gadgetType] = selectedGadget.gadget as IGadget;
      return acc;
    }, {});
  }

  async selectGadget(gadgetId: string, user: TokenPayload) {
    const gadget = await this.gadgetModel.findById(new mongoose.Types.ObjectId(gadgetId)).exec();

    if (!user?._id) { // user not logged in
      throw new ForbiddenException('User not logged in');
    }

    const selectedGadgetOfType = await this.selectedGadgetModel.findOne({
      user: user._id,
      gadgetType: gadget.type,
    }).exec();
    if (selectedGadgetOfType) { // update
      selectedGadgetOfType.gadget = gadget;
      return (await selectedGadgetOfType.save()).gadget;
    }

    const selectedGadget = await new this.selectedGadgetModel({
      user: user._id,
      gadget: gadgetId,
      gadgetType: gadget.type,
    }).save();
    await selectedGadget.populate('gadget');
    return selectedGadget.gadget;
  }
}
