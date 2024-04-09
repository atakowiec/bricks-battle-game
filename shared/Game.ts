import { IMap } from './Map';

export interface IGameMember {
  nickname: string;
  online: boolean;
  owner: boolean;
  paddlePosition: number;
  ballPosition: [number, number];
  board: string;
}

export interface GamePacket {
  id?: string;
  player?: IGameMember;
  opponent?: IGameMember;
  map?: IMap;
  status?: GameStatus;
}

export type GameStatus = 'waiting' | 'playing' | 'finished';