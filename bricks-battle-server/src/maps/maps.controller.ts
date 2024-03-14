import { Controller, Get, Param, Req } from '@nestjs/common';
import { MapsService } from './maps.service';
import { MapBlocksService } from './map-blocks/map-blocks.service';

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
}
