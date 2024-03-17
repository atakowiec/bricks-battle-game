import { Injectable } from '@nestjs/common';
import { IMapBlock } from '@shared/Map';
import { Base64 } from '../../utils/utils';

@Injectable()
export class MapBlocksService {
  private readonly mapBlocks: { [key: number]: IMapBlock } = {
    1: {
      id: '1',
      type: 'color',
      data: '#0000ff',
      unbreakable: false,
    },
    2: {
      id: '2',
      type: 'color',
      data: '#ff0000',
      unbreakable: true,
    },
    3: {
      id: '3',
      type: 'color',
      data: '#00ffff',
      unbreakable: false,
    },
    20: {
      id: 'K',
      type: 'color',
      data: '#ffffff',
      unbreakable: false,
    },
  };

  getBlock(id: number | string): IMapBlock {
    if (typeof id === 'string')
      id = Base64.toInt(id)
    return this.mapBlocks[id];
  }

  getBlocks() {
    return this.mapBlocks
  }
}
