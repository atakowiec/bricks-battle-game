import { IMap } from './Map';

export interface GameMember {
  nickname: string;
  online: boolean;
  owner: boolean;
}

export interface GamePacket {
  id?: string;
  player?: GameMember;
  opponent?: GameMember;
  map?: IMap;
  status?: GameStatus;
}

export type GameStatus = 'waiting' | 'playing' | 'finished';