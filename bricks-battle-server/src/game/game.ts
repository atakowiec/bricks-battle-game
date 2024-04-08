import { SocketType } from './game.types';
import { GamePacket, GameStatus } from '@shared/Game';
import { GameMember } from './game-member';
import { GameService } from './game.service';
import { WsException } from '@nestjs/websockets';
import { IMap } from '@shared/Map';

export default class Game {
  private gameService: GameService;
  public id: string;
  public owner: GameMember;
  public player: GameMember | null = null;
  public map: IMap;
  public gameStatus: GameStatus = 'waiting';

  private ownerDisconnectTimeout: NodeJS.Timeout;
  private playerDisconnectTimeout: NodeJS.Timeout;

  constructor(owner: SocketType, gameService: GameService) {
    this.gameService = gameService;

    this.id = Math.random().toString(36).slice(2, 9);
    this.owner = new GameMember(owner, this);

    this.owner.socket.join(this.id);
    this.owner.socket.data.gameId = this.id;

    console.log(`Game ${this.id} has been created by ${this.owner.nickname}`);
  }

  /**
   * Returns a packet with full game information for given player
   */
  public getPacket(member: SocketType): GamePacket {
    const result = {
      id: this.id,
      map: this.map,
      status: this.gameStatus,
    } as GamePacket;

    if (this.player?.nickname === member.data.nickname) {
      result.player = this.player.getPacket();
      result.opponent = this.owner.getPacket();
    }

    if (this.owner.nickname === member.data.nickname) {
      result.player = this.owner.getPacket();
      if (this.player)
        result.opponent = this.player.getPacket();
    }

    return result;
  }

  send(socket?: SocketType) {
    if (socket) {
      socket.emit('set_game', this.getPacket(socket));
    } else {
      this.owner.sendGame();
      this.player?.sendGame();
    }
  }

  join(client: SocketType) {
    if (this.player) {
      throw new WsException('Game is already full!');
    }

    this.player = new GameMember(client, this);

    client.join(this.id);
    client.data.gameId = this.id;

    this.owner.sendNotification(`${this.player.nickname} has joined the game!`);
    this.player.sendNotification('You have joined the game!');

    this.player.sendGame();
    this.owner.sendUpdate({
      opponent: this.player.getPacket(),
    });
  }

  public forceDestroy() {
    if (this.owner.socket) {
      delete this.owner.socket.data.gameId;
      this.owner.socket.leave(this.id);
      this.owner.socket.emit('set_game', null);
    }

    if (this.player?.socket) {
      delete this.player.socket.data.gameId;
      this.player.socket.leave(this.id);
      this.player?.socket.emit('set_game', null);
    }

    // todo here add more cleanup code (when we have more stuff to clean up)

    clearTimeout(this.ownerDisconnectTimeout);
    clearTimeout(this.playerDisconnectTimeout);

    this.owner = null;
    this.player = null;
  }

  onDisconnect(client: any) {
    if (client === this.owner.socket)
      this.onOwnerDisconnect();

    if (client === this.player?.socket)
      this.onPlayerDisconnect();
  }

  private onOwnerDisconnect() {
    if (!this.player) {
      console.log(`Game ${this.id} has been destroyed because owner has disconnected!`);
      this.gameService.destroyGame(this);
      return;
    }
    this.player.sendNotification('Owner has disconnected!');
    this.player.sendUpdate({
      opponent: this.owner.getPacket(),
    });

    this.ownerDisconnectTimeout = setTimeout(() => {
      console.log(`Game ${this.id} has been destroyed because owner has disconnected for too long!`);
      this.player?.sendNotification('Game has been deleted due to owner inactivity!');
      this.gameService.destroyGame(this);
    }, 30000);
  }

  private onPlayerDisconnect() {
    this.owner.sendNotification('Player has disconnected!');
    this.owner.sendUpdate({
      opponent: this.player.getPacket(),
    });

    this.playerDisconnectTimeout = setTimeout(() => {
      console.log(`Player ${this.player.nickname} has been kicked from game ${this.id} due to inactivity!`);
      this.owner.sendNotification('Player has been kicked from game due to inactivity!');
      this.playerQuit();
    }, 30000);
  }

  private playerQuit() {
    this.player.socket.leave(this.id);
    delete this.player.socket.data.gameId;

    this.player.socket.emit('set_game', null);

    this.player = null;

    this.owner.sendUpdate({
      opponent: null,
    });
  }

  reconnect(client: SocketType) {
    if (client.data.nickname === this.owner.nickname) {
      this.owner.socket = client;
      this.owner.socket.join(this.id);
      this.owner.socket.data.gameId = this.id;
      this.owner.sendNotification('You have reconnected to the game!');
      this.player?.sendNotification('Owner has reconnected to the game!');

      clearTimeout(this.ownerDisconnectTimeout);
    }

    if (this.player && client.data.nickname === this.player.nickname) {
      this.player.socket = client;
      this.player.socket.join(this.id);
      this.player.socket.data.gameId = this.id;
      this.player.sendNotification('You have reconnected to the game!');
      this.owner.sendNotification('Player has reconnected to the game!');

      clearTimeout(this.playerDisconnectTimeout);
    }

    this.send();
    console.log(`User ${client.data.nickname} has reconnected to game ${this.id}`);
  }

  kick(client: SocketType) {
    if (client != this.owner.socket) {
      throw new WsException('You are not the owner of this game!');
    }

    if (!this.player) {
      throw new WsException('You cannot do this now!');
    }

    // todo add some more checks here (when game will be implemented)
    this.player.sendNotification('You have been kicked from the game!');
    this.owner.sendNotification(`${this.player.nickname} has been kicked from the game!`);
    this.playerQuit();
  }

  async changeMap(client: SocketType, mapId: string) {
    if (client != this.owner.socket) {
      throw new WsException('You are not the owner of this game!');
    }

    const map = await this.gameService.mapsService.getIMap(mapId);

    if (!map) {
      throw new WsException('Internal Error: Map not found!');
    }

    if (map.owner && map.owner.nickname !== this.owner.nickname && map.type === 'personal') {
      throw new WsException('You cannot use this map!');
    }

    this.map = map;
    this.owner.sendNotification(`Map has been changed to ${this.map.name}`);

    const packet = { map: this.map };
    this.owner.sendUpdate(packet);
    this.player?.sendUpdate(packet);
  }

  leave(client: SocketType) {
    if (client === this.owner.socket) {
      this.owner.sendNotification('Game has been deleted!');
      this.player?.sendNotification('Game has been deleted!');
      this.gameService.destroyGame(this);
    }

    if (this.player && client === this.player.socket) {
      this.player.sendNotification('You have left the game!');
      this.owner.sendNotification('Player has left the game!');
      this.playerQuit();
    }
  }

  start(client: SocketType) {
    if (client != this.owner.socket) {
      throw new WsException('You are not the owner of this game!');
    }

    if (!this.player) {
      throw new WsException('Game is not full!');
    }

    this.gameStatus = 'playing';

    this.owner.sendNotification('Game has started!');
    this.player.sendNotification('Game has started!');

    this.owner.sendUpdate({ status: this.gameStatus });
    this.player.sendUpdate({ status: this.gameStatus });
  }
}
