import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import Game from './game';
import { SocketType } from './game.types';

@Injectable()
export class GameService {
  private readonly games: Game[] = [];

  constructor(
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway) {
    // empty
  }

  public isUsernameConnected(nickname: string): boolean {
    for (const socket of this.gameGateway.server.sockets.sockets.values()) {
      if (socket.data.nickname === nickname) {
        return true;
      }
    }

    return false;
  }

  public getGame(id: string): Game {
    return this.games.find(game => game.id === id);
  }

  public createGame(client: SocketType): Game {
    const game = new Game(client);
    this.games.push(game);

    return game;
  }
}
