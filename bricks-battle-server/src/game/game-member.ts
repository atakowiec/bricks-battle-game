import { SocketType } from './game.types';
import Game from './game';
import { GamePacket, IGameMember } from '@shared/Game';
import { decodeIMap } from '../utils/utils';

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
  public ballPosition: [number, number];
  public ballSize = 0.66;
  public board: number[][];

  constructor(socket: SocketType, game: Game) {
    this.game = game;
    this.sub = socket.data.sub;
    this.nickname = socket.data.nickname;
    this.socket = socket;
    this.paddlePositionX = 0;
    this.ballPosition = [0, 0];
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
      ballPosition: this.ballPosition,
      board: this.board,
      ballSize: this.ballSize,
    };
  }

  initProperties() {
    this.paddleSize = 3 + (this.game.map.size - 20) / 6;
    this.paddleThickness = 0.5 + 0.2 * ((this.game.map.size - 20) / 20);
    this.paddlePositionX = 0.5 * (this.game.map.size - this.paddleSize);
    this.paddlePositionY = this.game.map.size - 2 * this.paddleThickness;
    this.paddleSpeed = this.game.map.size / 120;
    this.ballPosition = [this.paddlePositionX + ((this.paddleSize - this.ballSize) * 0.5), this.paddlePositionY - this.ballSize - 0.1];
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
}