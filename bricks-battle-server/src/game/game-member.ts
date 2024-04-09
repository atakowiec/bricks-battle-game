import { SocketType } from './game.types';
import Game from './game';
import { GamePacket, IGameMember } from '@shared/Game';

export class GameMember {
  public nickname: string;
  public socket: SocketType;
  public game: Game;

  constructor(socket: SocketType, game: Game) {
    this.game = game;
    this.nickname = socket.data.nickname;
    this.socket = socket;
  }

  getPacket(): IGameMember {
    return {
      nickname: this.nickname,
      online: this.socket.connected,
      owner: this.game.owner === this,
      paddlePosition: Math.random() * this.game.map.size,
      ballPosition: [Math.random() * this.game.map.size, Math.random() * this.game.map.size],
      board: this.game.map.data, // todo set actual player data
    };
  }

  sendNotification(message: string) {
    this.socket.volatile.emit('notification', message);
  }

  sendUpdate(packet: GamePacket) {
    this.socket.emit('game_update', packet);
  }

  sendGame() {
    this.socket.emit('set_game', this.game.getPacket(this.socket));
  }
}