import { SocketType } from './game.types';
import { GamePacket, GameStatus, PaddleDirection } from '@shared/Game';
import { GameMember } from './game-member';
import { GameService } from './game.service';
import { WsException } from '@nestjs/websockets';
import { IMap } from '@shared/Map';

export default class Game {
  public gameService: GameService;
  public id: string;
  public owner: GameMember;
  public player: GameMember | null = null;
  public map: IMap;
  public gameStatus: GameStatus = 'waiting';
  public counting: number = 3;

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

  public tick() {
    if (this.gameStatus === 'playing') {
      this.owner.ball.tick();
      this.player.ball.tick();

      // send opponent paddle and ball position updates every 3 ticks
      // player who moved the paddle will get update immediately (in movePaddle method)
      if (GameService.currentTick % 3 === 0) {
        this.owner.sendUpdate({
          opponent: {
            paddlePositionX: this.player.paddle.positionX,
            ballPosition: this.player.ball.position,
          },
          player: {
            ballPosition: this.owner.ball.position,
          },
        });

        this.player.sendUpdate({
          opponent: {
            paddlePositionX: this.owner.paddle.positionX,
            ballPosition: this.owner.ball.position,
          },
          player: {
            ballPosition: this.player.ball.position,
          },
        });

        // send board updates
        this.sendBlockChanges();

        this.owner.paddle.moved = false;
        this.player.paddle.moved = false;
      }
    }

    if (GameService.currentTick % GameService.TICKS_PER_SECOND === 0) {
      this.countdown();
    }
  }

  public sendBlockChanges() {
    for (const changedBlock of this.owner.blockChanges) {
      const currentBlock = this.owner.board[changedBlock.y][changedBlock.x];
      this.owner.socket.emit('update_board', true, changedBlock.x, changedBlock.y, currentBlock);
      this.player.socket.emit('update_board', false, changedBlock.x, changedBlock.y, currentBlock);
    }

    for (const changedBlock of this.player.blockChanges) {
      const currentBlock = this.player.board[changedBlock.y][changedBlock.x];
      this.owner.socket.emit('update_board', false, changedBlock.x, changedBlock.y, currentBlock);
      this.player.socket.emit('update_board', true, changedBlock.x, changedBlock.y, currentBlock);
    }

    this.owner.blockChanges = [];
    this.player.blockChanges = [];
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

  private sendUpdate(packet: GamePacket) {
    this.owner.sendUpdate(packet);
    this.player?.sendUpdate(packet);
  }

  sendTitle(title: string, time?: number) {
    this.owner.sendTitle(title, time);
    this.player?.sendTitle(title, time);
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

    if (this.gameStatus == 'playing' || this.gameStatus == 'starting') {
      this.gameStatus = 'paused';
      this.sendUpdate({
        status: this.gameStatus,
      });
    }
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

    if (this.gameStatus == 'playing' || this.gameStatus == 'starting' || this.gameStatus == 'paused' || this.gameStatus == 'finished') {
      this.gameStatus = 'waiting';
    }

    this.owner.sendUpdate({
      opponent: null,
      status: this.gameStatus,
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

    if (this.player && this.player.socket.connected && this.owner.socket.connected) {
      if (this.gameStatus === 'paused') {
        this.gameStatus = 'starting';
        this.counting = 3;
      }
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

    if (this.gameStatus != 'waiting') {
      throw new WsException('You cannot kick player during the game!');
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

    if (map.owner && map.owner.toString() !== this.owner.sub && map.type === 'personal') {
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

  async start(client: SocketType) {
    if (client != this.owner.socket) {
      throw new WsException('You are not the owner of this game!');
    }

    if (!this.player) {
      throw new WsException('Game is not full!');
    }

    this.gameStatus = 'starting';
    this.counting = 3;

    // init members properties like paddle position, ball position, etc.
    await this.owner.initProperties();
    await this.player.initProperties();

    this.owner.sendNotification('Game has started!');
    this.player.sendNotification('Game has started!');

    // send game update to both players
    this.owner.sendUpdate({
      status: this.gameStatus,
      player: this.owner.getPacket(),
      opponent: this.player.getPacket(),
    });
    this.player.sendUpdate({
      status: this.gameStatus,
      player: this.player.getPacket(),
      opponent: this.owner.getPacket(),
    });
  }

  countdown() {
    if (this.gameStatus != 'starting' || this.counting < 0)
      return;

    if (this.counting === 0) {
      this.gameStatus = 'playing';
      this.sendTitle('Start!', 2000);
      this.sendUpdate({
        status: this.gameStatus,
      });
      return;
    }

    this.sendTitle((this.counting--).toString());
  }

  movePaddle(client: SocketType, direction: PaddleDirection) {
    const gameMember = client === this.owner.socket ? this.owner : this.player;

    gameMember.paddle.move(direction);

    // game member is the player who moved the paddle, so we send update to him asap, opponent will get update in next tick
    gameMember.sendUpdate({
      player: {
        paddlePositionX: gameMember.paddle.positionX,
      },
    });
  }

  getOpponent(member: GameMember) {
    return member === this.owner ? this.player : this.owner;
  }

  serveBall(client: SocketType) {
    const gameMember = client === this.owner.socket ? this.owner : this.player;
    if (!gameMember.ball.isServing) return;

    gameMember.ball.isServing = false;
    gameMember.ball.direction = -Math.PI / 2;
  }

  endGame(winner: GameMember) {
    this.gameStatus = 'finished';
    this.sendBlockChanges();
    this.sendUpdate({
      status: this.gameStatus,
      winner: winner.nickname,
    });
  }

  playAgain(client: SocketType) {
    if (client != this.owner.socket) {
      throw new WsException('Only owner can start new game!');
    }

    if (this.gameStatus != 'finished') {
      throw new WsException('Game is not finished!');
    }

    this.gameStatus = 'waiting';

    this.owner.sendUpdate({
      status: this.gameStatus,
    });

    this.player.sendUpdate({
      status: this.gameStatus,
    });

    this.owner.sendNotification('Game has been restarted!');
    this.player.sendNotification('Owner has restarted the game!');
  }
}
