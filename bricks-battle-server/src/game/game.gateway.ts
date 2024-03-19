import {
  OnGatewayConnection, OnGatewayDisconnect,
  WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
import { SocketType } from './game.types';
import { Server } from 'socket.io';
import { parse } from 'cookie';
import { JwtService } from '@nestjs/jwt';


@WebSocketGateway({ cors: true, credentials: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly jwtService: JwtService) {
    // empty
  }

  handleConnection(client: SocketType) {
    const cookies = parse(client.handshake.headers.cookie);
    const payload = this.jwtService.decode(cookies.access_token);

    console.log(`Socket has connected! Nickname: ${payload.nickname}, logged in: ${!!payload.sub}`);

    client.data.nickname = payload.nickname;
    client.data.sub = payload.sub;
  }

  handleDisconnect(client: any) {
    console.log(`Socket has disconnected! Nickname: ${client.data.nickname}`);
    // todo disconnect logic (in the future)
  }

  public isUsernameConnected(nickname: string): boolean {
    for (const socket of this.server.sockets.sockets.values()) {
      if (socket.data.nickname === nickname) {
        return true;
      }
    }

    return false
  }
}