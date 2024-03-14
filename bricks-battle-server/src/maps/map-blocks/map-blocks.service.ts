import { Injectable } from '@nestjs/common';
import { IMapBlock } from '@shared/Map';

@Injectable()
export class MapBlocksService {
  private readonly mapBlocks: { [key: number]: IMapBlock } = {
    1: {
      id: 1,
      type: 'color',
      data: '#0000ff',
      unbreakable: false,
    },
    2: {
      id: 2,
      type: 'color',
      data: '#ff0000',
      unbreakable: true,
    },
  };

  getBlock(id: number | string): IMapBlock {
    if (typeof id === 'string')
      id = atob(id);
    return this.mapBlocks[id];
  }

  getBlocks() {
    return this.mapBlocks
  }
}
