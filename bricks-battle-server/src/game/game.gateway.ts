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
import SubscribeMessage from 'src/socket/subscribe-message.decorator';
import { forwardRef, Inject, UseFilters } from '@nestjs/common';
import { WsExceptionFilter } from '../socket/ws-exception.filter';
import { GameService } from './game.service';
import { EventWsException } from '../socket/event-ws-exception';
import { GameId } from '../socket/game-id.decorator';
import { PaddleDirection } from '@shared/Game';


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

    const game = this.gameService.getUserGame(client.data.nickname);

    if (!game) return;

    game.reconnect(client);
  }

  handleDisconnect(client: any) {
    console.log(`Socket has disconnected! Nickname: ${client.data.nickname}`);

    if (!client.data.gameId)
      return;

    const game = this.gameService.getGame(client.data.gameId);
    if (!game) return;

    game.onDisconnect(client);
  }

  @UseFilters(WsExceptionFilter)
  @SubscribeMessage('create_game')
  async createNewGame(@ConnectedSocket() client: SocketType, @MessageBody() mapId?: string) {
    if (client.data.gameId) {
      throw new WsException('You are already in a game!');
    }

    const game = await this.gameService.createGame(client, mapId);
    game.send(client);
    game.owner.sendNotification('You have created a game!');

    // return anything so the client will execute the callback
    return 'Boo';
  }

  @UseFilters(WsExceptionFilter)
  @SubscribeMessage('join_game')
  joinGame(@ConnectedSocket() client: SocketType, @MessageBody() gameId: string) {
    if (client.data.gameId) {
      throw new EventWsException('You are already in a game!');
    }

    const game = this.gameService.getGame(gameId);

    if (!game) {
      throw new EventWsException('Game not found!');
    }

    game.join(client);
  }

  @UseFilters(WsExceptionFilter)
  @SubscribeMessage('kick')
  kick(@ConnectedSocket() client: SocketType) {
    if (!client.data.gameId) {
      throw new WsException('You are not in a game!');
    }

    const game = this.gameService.getGame(client.data.gameId);

    if (!game) {
      throw new WsException('Game not found!');
    }

    game.kick(client);
  }

  @UseFilters(WsExceptionFilter)
  @SubscribeMessage('change_map')
  async changeMap(@ConnectedSocket() client: SocketType, @MessageBody() mapId: string, @GameId() gameId: string) {
    const game = this.gameService.getGame(gameId);

    if (!game) {
      throw new EventWsException('Game not found!');
    }

    await game.changeMap(client, mapId);
    console.log(`User ${client.data.nickname} has changed map to ${mapId}`);

    // return anything so the client will execute the callback
    return 'Ponk';
  }

  @UseFilters(WsExceptionFilter)
  @SubscribeMessage('leave_game')
  leaveGame(@ConnectedSocket() client: SocketType, @GameId() gameId: string) {
    const game = this.gameService.getGame(gameId);

    if (!game) {
      throw new WsException('Game not found!');
    }

    game.leave(client);
  }

  @UseFilters(WsExceptionFilter)
  @SubscribeMessage('start_game')
  startGame(@ConnectedSocket() client: SocketType, @GameId() gameId: string) {
    const game = this.gameService.getGame(gameId);

    if (!game) {
      throw new WsException('Game not found!');
    }

    game.start(client);
  }

  @UseFilters(WsExceptionFilter)
  @SubscribeMessage('move_paddle')
  movePaddle(@ConnectedSocket() client: SocketType, @MessageBody() direction: PaddleDirection, @GameId() gameId: string) {
    const game = this.gameService.getGame(gameId);

    if (!game) {
      throw new WsException('You are not in a game!');
    }

    game.movePaddle(client, direction);
  }

  @UseFilters(WsExceptionFilter)
  @SubscribeMessage('serve_ball')
  serveBall(@ConnectedSocket() client: SocketType, @GameId() gameId: string) {
    const game = this.gameService.getGame(gameId);

    if (!game) {
      throw new WsException('You are not in a game!');
    }

    game.serveBall(client);
  }
}