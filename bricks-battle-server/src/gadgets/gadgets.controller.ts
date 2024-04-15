import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GadgetsService } from './gadgets.service';
import { GadgetType } from '@shared/Gadgets';
import { CreateGadgetDto } from './create-gadget.dto';

@Controller('gadgets')
export class GadgetsController {
  constructor(private readonly gadgetsService: GadgetsService) {
    // empty
  }

  @Get("all/:type")
  async getByType(@Param('type') type: GadgetType) {
    return this.gadgetsService.getAllGadgetsByType(type);
  }

  @Post()
  async createGadget(@Body() createGadgetDto: CreateGadgetDto) { // todo add some admin role
    return this.gadgetsService.createGadget(createGadgetDto);
  }
}
