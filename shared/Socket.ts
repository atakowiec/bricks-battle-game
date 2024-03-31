import { GamePacket } from './Game';

export interface ServerToClientEvents {
  exception: (error: string) => void;
  set_game: (game: GamePacket) => void;
  game_update: (game: GamePacket) => void;
  notification: (message: string) => void;
  event_exception: (error: string) => void;
}

export type ServerToClientEventsKeys = keyof ServerToClientEvents

export type ServerToClientEventsValues = Parameters<ServerToClientEvents[keyof ServerToClientEvents]>

export interface ClientToServerEvents {
  create_game: (mapId?: string, cb?: () => void) => void;
  join_game: (gameId: string) => void;
  kick: () => void;
  change_map: (mapId: string, cb: () => void) => void;
}

export type ClientToServerEventsKeys = keyof ClientToServerEvents

export type ClientToServerEventsValues = Parameters<ClientToServerEvents[keyof ClientToServerEvents]>