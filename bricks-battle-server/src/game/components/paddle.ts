import { GameMember } from '../game-member';
import { PaddleDirection } from '@shared/Game';

export class Paddle {
  private paddleOwner: GameMember;
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

  collidesWithBall(): boolean {
    const ballSize = this.paddleOwner.ball.size;
    const ballX = this.paddleOwner.ball.position[0];
    const ballY = this.paddleOwner.ball.position[1];

    // ball is too high
    if (ballY + ballSize < this.positionY) return false;

    // ball is too low
    if (ballY - ballSize > this.positionY + this.thickness) return false;

    // ball is on the left side of the paddle
    if (ballX + ballSize < this.positionX) return false;

    // ball is on the right side of the paddle
    if (ballX - ballSize > this.positionX + this.size) return false;

    // if none of the above, the ball is colliding with the paddle
    return true;
  }
}