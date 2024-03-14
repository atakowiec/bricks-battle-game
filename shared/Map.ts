export type MapType = 'official' | 'community' | 'personal';

export interface IMap {
  _id: string;
  name: string;
  type: MapType;
  ownerId: string;
}

// image is not supported yet
export type MapBlockType = 'image' | 'color';

export interface IMapBlock {
  id: number;
  type: MapBlockType;
  data: string;
  unbreakable: boolean;
}