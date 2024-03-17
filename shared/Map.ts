export type MapType = 'official' | 'community' | 'personal';

export interface IMap {
  _id: string;
  name: string;
  type: MapType;
  size: number;
  owner: { nickname: string };
  difficulty: MapDifficulty;
  data: string;
}

// image is not supported yet
export type MapBlockType = 'image' | 'color';

export type MapDifficulty = 'easy' | 'normal' | 'hard'

export interface IMapBlock {
  id: string;
  type: MapBlockType;
  data: string;
  unbreakable: boolean;
}