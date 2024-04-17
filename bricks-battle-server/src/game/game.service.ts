import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import Game from './game';
import { SocketType } from './game.types';
import { MapsService } from '../maps/maps.service';
import { GadgetsService } from '../gadgets/gadgets.service';

@Injectable()
export class GameService {
  public static readonly TICKS_PER_SECOND = 50;
  public static currentTick = 0;

  private readonly games: Game[] = [];

  constructor(
    public readonly mapsService: MapsService,
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway,
    public readonly gadgetService: GadgetsService) {

    setInterval(() => this.tickGames(), 1000 / GameService.TICKS_PER_SECOND);
  }

  public tickGames() {
    GameService.currentTick++;

    if (!this.games) return;

    for (const game of this.games) {
      game.tick();
    }
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

  public async createGame(client: SocketType, mapId: string): Promise<Game> {
    // todo change random to last played map or something
    const map = mapId ? await this.mapsService.getIMap(mapId) : await this.mapsService.getRandomIMap();

    const game = new Game(client, this);
    this.games.push(game);
    game.map = map;

    return game;
  }

  destroyGame(game: Game) {
    const index = this.games.indexOf(game);
    this.games.splice(index, 1);

    game.forceDestroy();
  }

  getUserGame(nickname: string) {
    return this.games.find(game => game.owner.nickname === nickname || game.player?.nickname === nickname);
  }
}
