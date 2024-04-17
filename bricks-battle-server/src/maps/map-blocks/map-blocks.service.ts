import { Injectable } from '@nestjs/common';
import { IMapBlock } from '@shared/Map';
import { Base64 } from '../../utils/utils';

@Injectable()
export class MapBlocksService {
  private readonly mapBlocks: { [key: number]: IMapBlock } = this.translateBlocks([
    {
      id: '1',
      type: 'color',
      data: '#0000ff',
    }, {
      id: '2',
      type: 'color',
      data: '#ff00ff',
    }, {
      id: '3',
      type: 'color',
      data: '#00ffff',
    }, {
      id: '20',
      type: 'color',
      data: '#ffff00',
    }, {
      id: '32',
      type: 'color',
      data: '#ff0000',
    },
  ]);

  getBlock(id: number | string): IMapBlock {
    if (typeof id === 'string')
      id = Base64.toInt(id);
    return this.mapBlocks[id];
  }

  getBlocks() {
    return this.mapBlocks;
  }

  private translateBlocks(blocks: IMapBlock[]) {
    return blocks.reduce((acc, block) => {
      const intId = parseInt(block.id);
      block.unbreakable = intId > 31;
      acc[intId] = block;
      block.id = Base64.fromInt(intId);
      return acc;
    }, {});
  }
}
