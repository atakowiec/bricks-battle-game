import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MapsService } from './maps.service';
import { MapBlocksService } from './map-blocks/map-blocks.service';
import { CreateMapDto } from './createMap.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('maps')
export class MapsController {
  constructor(
    private readonly mapsService: MapsService,
    private readonly mapBlocksService: MapBlocksService,
  ) {
  }

  @Get('/blocks')
  getBlocks() {
    return this.mapBlocksService.getBlocks();
  }

  @Get(':type')
  getMapsByType(@Param('type') type: string, @Req() req: Request) {
    return this.mapsService.getMapsByType(type, req);
  }

  @UseGuards(AuthGuard)
  @Post()
  saveMap(@Body() createMapDto: CreateMapDto, @Req() req: Request) {
    return this.mapsService.saveMap(createMapDto, req);
  }
}
