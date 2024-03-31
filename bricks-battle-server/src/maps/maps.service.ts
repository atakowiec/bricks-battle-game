import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.schema';
import { CreateMapDto } from './create-map.dto';
import { Map } from './map.schema';
import { MapBlocksService } from './map-blocks/map-blocks.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMap, MapDifficulty, MapType } from '@shared/Map';
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
      throw new BadRequestException('Invalid map size');
    }

    // check if map data is valid and all blocks are defined
    if (body.data.split('').some(char => char != '0' && this.mapBlocksService.getBlock(char) == null)) {
      throw new BadRequestException('Invalid map data');
    }

    user = await this.usersService.getUserById(user.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
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

  async getRandomIMap(): Promise<IMap> {
    const matchingDocuments = await this.mapModel.find({ type: 'official' });
    const totalDocuments = matchingDocuments.length;
    const randomIndex = Math.floor(Math.random() * totalDocuments);
    const result = matchingDocuments[randomIndex];

    return this.asIMap(result);
  }

  async getIMap(mapId: string) {
    const result = await this.mapModel.findById(mapId);

    return this.asIMap(result);
  }

  private asIMap(map: Map): IMap {
    return {
      _id: map._id.toString(),
      name: map.name,
      type: map.type,
      size: map.size,
      owner: map.owner,
      difficulty: map.difficulty as MapDifficulty,
      data: map.data,
    }
  }
}
