import { GamePacket, PaddleDirection } from './Game';

export interface ServerToClientEvents {
  exception: (error: string) => void;
  set_game: (game: GamePacket) => void;
  game_update: (game: GamePacket) => void;
  notification: (message: string, time?: number) => void;
  title: (title: string, time?: number) => void;
  event_exception: (error: string) => void;
  set_paddle: (position: number) => void;
  update_board: (playerBoard: boolean, x: number, y: number, newBlock: number) => void;
  select_opponent_gadget: (gadget: string) => void;
}

export type ServerToClientEventsKeys = keyof ServerToClientEvents

export type ServerToClientEventsValues = Parameters<ServerToClientEvents[keyof ServerToClientEvents]>

export interface ClientToServerEvents {
  create_game: (mapId?: string, cb?: () => void) => void;
  join_game: (gameId: string) => void;
  kick: () => void;
  change_map: (mapId: string, cb: () => void) => void;
  leave_game: () => void;
  start_game: () => void;
  move_paddle: (direction: PaddleDirection) => void;
  serve_ball: () => void;
  play_again: () => void;
}

export type ClientToServerEventsKeys = keyof ClientToServerEvents

export type ClientToServerEventsValues = Parameters<ClientToServerEvents[keyof ClientToServerEvents]>