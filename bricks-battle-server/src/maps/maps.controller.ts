import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MapsService } from './maps.service';
import { MapBlocksService } from './map-blocks/map-blocks.service';
import { CreateMapDto } from './create-map.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RequestUser } from '../users/user.decorator';
import { User } from '../users/user.schema';
import { MapType } from '@shared/Map';

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
  getMapsByType(@Param('type') type: MapType, @RequestUser() user: User) {
    return this.mapsService.getMapsByType(type, user);
  }

  @UseGuards(AuthGuard)
  @Post()
  saveMap(@Body() createMapDto: CreateMapDto, @RequestUser() user: User) {
    return this.mapsService.saveMap(createMapDto, user);
  }
}
