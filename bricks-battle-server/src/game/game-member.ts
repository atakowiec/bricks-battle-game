import { SocketType } from './game.types';
import Game from './game';
import { GamePacket, IGameMember } from '@shared/Game';
import { decodeIMap } from '../utils/utils';
import { Ball } from './components/ball';
import { Paddle } from './components/paddle';
import { SelectedGadgets } from '@shared/Gadgets';
import mongoose from 'mongoose';

export class GameMember {
  public nickname: string;
  public sub: string;
  public socket: SocketType;
  public game: Game;

  public selectedGadgets: SelectedGadgets = {};
  public paddle = new Paddle(this);
  public ball = new Ball(this);
  public board: number[][];

  public lives = 3;

  public blockChanges: { x: number, y: number }[] = [];

  constructor(socket: SocketType, game: Game) {
    this.game = game;
    this.sub = socket.data.sub;
    this.nickname = socket.data.nickname;
    this.socket = socket;
    this.board = [];
  }

  getPacket(): IGameMember {
    return {
      nickname: this.nickname,
      online: this.socket.connected,
      owner: this.game.owner === this,
      paddlePositionX: this.paddle.positionX,
      paddlePositionY: this.paddle.positionY,
      paddleSize: this.paddle.size,
      paddleThickness: this.paddle.thickness,
      paddleSpeed: this.paddle.speed,
      ballPosition: this.ball.position,
      board: this.board,
      ballSize: this.ball.size,
      lives: this.lives,
      selectedGadgets: this.selectedGadgets,
    };
  }

  async initProperties() {
    this.paddle.size = 3 + (this.game.map.size - 20) / 6;
    this.paddle.thickness = 0.5 + 0.2 * ((this.game.map.size - 20) / 20);
    this.paddle.positionX = 0.5 * (this.game.map.size - this.paddle.size);
    this.paddle.positionY = this.game.map.size - 2 * this.paddle.thickness;
    this.paddle.speed = this.game.map.size / 120;
    this.ball.position = [this.paddle.positionX + (this.paddle.size / 2), this.paddle.positionY - this.ball.size * 2 - 0.1];
    this.board = decodeIMap(this.game.map);
    this.lives = 3;

    // Get selected gadgets from the database before the game starts
    this.selectedGadgets = await this.game.gameService.gadgetService.getSelectedGadgets(new mongoose.Types.ObjectId(this.sub));
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

  sendTitle(title: string, time?: number) {
    this.socket.volatile.emit('title', title, time);
  }

  updateBlock(x: number, y: number, newBlock: number) {
    this.board[y][x] = newBlock;
    this.blockChanges.push({ x, y });

    if (this.board.every(row => row.every(cell => cell === 0 || cell > 31))) {
      this.game.endGame(this);
    }
  }

  decreaseLives() {
    this.lives--;

    this.sendUpdate({
      player: {
        lives: this.lives,
      },
    });

    this.game.getOpponent(this).sendUpdate({
      opponent: {
        lives: this.lives,
      },
    });

    if (this.lives === 0) {
      this.game.endGame(this.game.getOpponent(this));
    }

    this.ball.isServing = true;
    this.ball.resetPosition();
  }
}