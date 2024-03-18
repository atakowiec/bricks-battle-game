export interface ServerToClientEvents {

}

export type ServerToClientEventsKeys = keyof ServerToClientEvents

export type ServerToClientEventsValues = Parameters<ServerToClientEvents[keyof ServerToClientEvents]>

export interface ClientToServerEvents {
    create_game: () => void
}

export type ClientToServerEventsKeys = keyof ClientToServerEvents

export type ClientToServerEventsValues = Parameters<ClientToServerEvents[keyof ClientToServerEvents]>