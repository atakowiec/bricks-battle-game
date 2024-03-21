import { SocketType } from './game.types';
import Game from './game';

export class GameMember {
  public nickname: string;
  public socket: SocketType;
  public game: Game;

  constructor(socket: SocketType, game: Game) {
    this.game = game;
    this.nickname = socket.data.nickname;
    this.socket = socket;
  }

  getPacket() {
    return {
      nickname: this.nickname,
      online: this.socket.connected,
      owner: this.game.owner === this,
    };
  }

  sendNotification(message: string) {
    this.socket.volatile.emit('notification', message);
  }
}