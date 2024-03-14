import { Module } from '@nestjs/common';
import { MapsService } from './maps.service';
import { MapsController } from './maps.controller';
import { MapBlocksService } from './map-blocks/map-blocks.service';

@Module({
  providers: [MapsService, MapBlocksService],
  controllers: [MapsController]
})
export class MapsModule {}
