import { Injectable } from '@nestjs/common';
import { User } from '../users/user.schema';
import { CreateMapDto } from './create-map.dto';
import { Map } from './map.schema';
import { MapBlocksService } from './map-blocks/map-blocks.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MapType } from '@shared/Map';
import { UsersService } from '../users/users.service';

@Injectable()
export class MapsService {
  constructor(private readonly mapBlocksService: MapBlocksService,
              @InjectModel(Map.name) private mapModel: Model<Map>,
              private readonly usersService: UsersService) {
    // empty
  }

  getMapsByType(type: MapType, user: User) {
    if (type === 'personal') {
      if (!user?.sub) {
        return [];
      }
      return this.mapModel.find({ owner: user.sub, type });
    }

    if (type === 'official') {
      return this.mapModel.find({ type });
    }

    if (type === 'community') {
      return this.mapModel.find({ type: 'personal' }).populate('owner', { nickname: 1 });
    }
  }

  async saveMap(body: CreateMapDto, user: User) {
    // check if map is valid
    if (body.size < 15 || body.size > 40) {
      throw new Error('Invalid map size');
    }

    // check if map data is valid and all blocks are defined
    if (body.data.split('').some(char => char != '0' && this.mapBlocksService.getBlock(char) == null)) {
      throw new Error('Invalid map data');
    }

    user = await this.usersService.getUserById(user.sub);
    if (!user) {
      throw new Error('User not found');
    }

    const map = new this.mapModel();
    map.type = 'personal';
    map.name = body.name;
    map.owner = user;
    map.size = body.size;
    map.data = body.data;
    map.difficulty = body.difficulty;

    return map.save();
  }
}
