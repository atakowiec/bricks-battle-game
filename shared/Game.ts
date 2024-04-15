import { IMap } from './Map';

export interface IGameMember {
  nickname: string;
  online: boolean;
  owner: boolean;
  paddlePositionX: number;
  paddlePositionY: number;
  paddleSize: number;
  paddleThickness: number;
  paddleSpeed: number;
  ballPosition: [number, number];
  board: number[][];
  ballSize: number;
  lives: number;
}

export interface GamePacket {
  id?: string;
  player?: Partial<IGameMember>;
  opponent?: Partial<IGameMember>;
  map?: IMap;
  status?: GameStatus;
}

export type GameStatus = 'waiting' | 'starting' | 'playing' | 'paused' | 'finished';

export type PaddleDirection = 'left' | 'right';