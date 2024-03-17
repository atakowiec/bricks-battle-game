import { Injectable } from '@nestjs/common';
import { User } from '../users/user.schema';
import { CreateMapDto } from './create-map.dto';
import { Map } from './map.schema';
import { MapBlocksService } from './map-blocks/map-blocks.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MapType } from '@shared/Map';

@Injectable()
export class MapsService {
  constructor(private readonly mapBlocksService: MapBlocksService,
              @InjectModel(Map.name) private mapModel: Model<Map>) {
    // empty
  }

  getMapsByType(type: MapType, user: User) {
    if (type === 'personal') {
      if (!user?.sub) {
        console.log(user);
        return [];
      }
      return this.mapModel.find({ ownerId: user.sub, type });
    } else {
      return this.mapModel.find({ type });
    }
  }

  saveMap(body: CreateMapDto, user: User) {
    // check if map is valid
    if (body.size < 15 || body.size > 40) {
      throw new Error('Invalid map size');
    }

    // check if map data is valid and all blocks are defined
    if (body.data.split('').some(char => char != '0' && this.mapBlocksService.getBlock(char) == null)) {
      throw new Error('Invalid map data');
    }

    const map = new this.mapModel();
    map.type = 'personal';
    map.name = body.name;
    map.ownerId = user.sub;
    map.size = body.size;
    map.data = body.data;

    if (!map.ownerId)
      throw new Error('Invalid user');

    return map.save();
  }
}
