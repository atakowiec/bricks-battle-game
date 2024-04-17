import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GadgetsService } from './gadgets.service';
import { GadgetType } from '@shared/Gadgets';
import { CreateGadgetDto } from './create-gadget.dto';
import { AdminGuard } from '../auth/admin.guard';
import { RequestUser } from '../users/request-user.decorator';
import { TokenPayload } from '../types/request.type';

@Controller('gadgets')
export class GadgetsController {
  constructor(private readonly gadgetsService: GadgetsService) {
    // empty
  }

  @Get('all/:type')
  async getByType(@Param('type') type: GadgetType) {
    return this.gadgetsService.getAllGadgetsByType(type);
  }

  @UseGuards(AdminGuard)
  @Post()
  async createGadget(@Body() createGadgetDto: CreateGadgetDto) {
    return this.gadgetsService.createGadget(createGadgetDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async deleteGadget(@Param('id') id: string) {
    return this.gadgetsService.deleteGadget(id);
  }

  @Get('select/:gadgetId')
  async selectGadget(@Param('gadgetId') gadgetId: string, @RequestUser() user: TokenPayload) {
    return this.gadgetsService.selectGadget(gadgetId, user);
  }

  @Get('selected')
  async getSelected(@RequestUser() user: TokenPayload) {
    return user?._id ? this.gadgetsService.getSelectedGadgets(user._id) : {};
  }
}
