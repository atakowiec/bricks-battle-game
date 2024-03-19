import {
  ConnectedSocket,
  OnGatewayConnection, OnGatewayDisconnect,
  WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
import { SocketType } from './game.types';
import { Server } from 'socket.io';
import { parse } from 'cookie';
import { JwtService } from '@nestjs/jwt';
import SubscribeMessage from 'src/utils/subscribe-message.decorator';
import { RequireNickname } from './require-nickname.guard';
import { UseFilters, UseGuards } from '@nestjs/common';
import { WsExceptionFilter } from './ws-exception.filter';


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

  @UseGuards(RequireNickname)
  @UseFilters(WsExceptionFilter)
  @SubscribeMessage('create_game')
  createNewGame(@ConnectedSocket() client: SocketType) {
    console.log(`New game has been created by ${client.data.nickname}`);
    // todo create game logic (in the future)
  }
}