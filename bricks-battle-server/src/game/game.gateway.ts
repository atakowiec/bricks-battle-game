import {
  ConnectedSocket, MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer, WsException,
} from '@nestjs/websockets';
import { SocketServerType, SocketType } from './game.types';
import { parse } from 'cookie';
import { JwtService } from '@nestjs/jwt';
import SubscribeMessage from 'src/utils/subscribe-message.decorator';
import { RequireNickname } from './require-nickname.guard';
import { forwardRef, Inject, UseFilters, UseGuards } from '@nestjs/common';
import { WsExceptionFilter } from './ws-exception.filter';
import { GameService } from './game.service';


@WebSocketGateway({ cors: true, credentials: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: SocketServerType;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService) {
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
    if (client.data.gameId) {
      throw new WsException('You are already in a game!');
    }

    const game = this.gameService.createGame(client)
    game.send(client);
    game.owner.sendNotification('You have created a game!')
  }

  @UseGuards(RequireNickname)
  @UseFilters(WsExceptionFilter)
  @SubscribeMessage('join_game')
  joinGame(@ConnectedSocket() client: SocketType, @MessageBody() gameId: string) {
    if (client.data.gameId) {
      throw new WsException('You are already in a game!');
    }

    const game = this.gameService.getGame(gameId);

    if (!game) {
      throw new WsException('Game not found!');
    }

    game.join(client);
  }
}