import {Server as SocketIOServer, Socket} from "socket.io";
import {ClientToServerEvents, ServerToClientEvents} from "@shared/Socket";

export interface InterServerEvents {

}

export type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

export type SocketServerType = SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

export interface SocketData {

}