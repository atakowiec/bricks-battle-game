import { Module } from '@nestjs/common';
import { MapsService } from './maps.service';
import { MapsController } from './maps.controller';
import { MapBlocksService } from './map-blocks/map-blocks.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MapSchema } from './map.schema';

@Module({
  imports: [AuthModule,
    MongooseModule.forFeature([{ name: Map.name, schema: MapSchema }])],
  providers: [MapsService, MapBlocksService],
  controllers: [MapsController],
})
export class MapsModule {
}
