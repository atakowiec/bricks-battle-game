import { IMap } from './Map';
import { SelectedGadgets } from './Gadgets';
import { IDrop } from './Drops';

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
  selectedGadgets: SelectedGadgets;
  drops: IDrop[];
}

export interface GamePacket {
  id?: string;
  player?: Partial<IGameMember>;
  opponent?: Partial<IGameMember>;
  map?: IMap;
  status?: GameStatus;
  winner?: string;
}

export type GameStatus = 'waiting' | 'starting' | 'playing' | 'paused' | 'owner_paused' | 'finished';

export type PaddleDirection = 'left' | 'right';