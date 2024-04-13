import { SocketType } from './game.types';
import Game from './game';
import { GamePacket, IGameMember } from '@shared/Game';
import { decodeIMap } from '../utils/utils';
import { Ball } from './components/ball';

export class GameMember {
  public nickname: string;
  public sub: string;
  public socket: SocketType;
  public game: Game;

  public paddlePositionX: number;
  public paddlePositionY: number;
  public paddleSize = 3;
  public paddleThickness = 0;
  public paddleSpeed = 0.5;
  public paddleMoved = false;

  public ball = new Ball(this);

  public board: number[][];

  constructor(socket: SocketType, game: Game) {
    this.game = game;
    this.sub = socket.data.sub;
    this.nickname = socket.data.nickname;
    this.socket = socket;
    this.paddlePositionX = 0;
    this.board = [];
  }

  getPacket(): IGameMember {
    return {
      nickname: this.nickname,
      online: this.socket.connected,
      owner: this.game.owner === this,
      paddlePositionX: this.paddlePositionX,
      paddlePositionY: this.paddlePositionY,
      paddleSize: this.paddleSize,
      paddleThickness: this.paddleThickness,
      paddleSpeed: this.paddleSpeed,
      ballPosition: this.ball.position,
      board: this.board,
      ballSize: this.ball.size,
    };
  }

  initProperties() {
    this.paddleSize = 3 + (this.game.map.size - 20) / 6;
    this.paddleThickness = 0.5 + 0.2 * ((this.game.map.size - 20) / 20);
    this.paddlePositionX = 0.5 * (this.game.map.size - this.paddleSize);
    this.paddlePositionY = this.game.map.size - 2 * this.paddleThickness;
    this.paddleSpeed = this.game.map.size / 120;
    this.ball.position = [this.paddlePositionX + ((this.paddleSize - this.ball.size * 2) * 0.5), this.paddlePositionY - this.ball.size * 2 - 0.1];
    this.board = decodeIMap(this.game.map);
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

  sendTitle(title: string) {
    this.socket.volatile.emit('title', title);
  }
}