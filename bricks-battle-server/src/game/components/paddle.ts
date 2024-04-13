import { GameMember } from '../game-member';
import { PaddleDirection } from '@shared/Game';

export class Paddle {
  private paddleOwner: GameMember
  public positionX = 0;
  public positionY = 0;
  public size = 3;
  public thickness = 0;
  public speed = 0.5;
  public moved = false;

  constructor(paddleOwner: GameMember) {
    this.paddleOwner = paddleOwner;
  }

  move(direction: PaddleDirection) {
    this.positionX += direction == 'left' ? -this.speed : this.speed;
    this.positionX = Math.max(0, Math.min(this.paddleOwner.game.map.size - this.size, this.positionX));
    this.moved = true;
  }
}