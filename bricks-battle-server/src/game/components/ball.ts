import { GameMember } from '../game-member';
import { flipByXAxis, flipByYAxis } from '../../utils/math-utils';

export class Ball {
  public readonly ballOwner: GameMember;

  public position: [number, number] = [0, 0]; // center of the ball
  public size = 0.33;
  public speed = 0.2;
  public direction: number = -Math.PI / 4;

  constructor(ballOwner: GameMember) {
    this.ballOwner = ballOwner;
  }

  private getMapSize() {
    return this.ballOwner.game.map.size;
  }

  public tick() {
    let xFlipped = false;
    let yFlipped = false;

    const flipX = () => {
      if (xFlipped) return; // don't flip twice in one tick
      this.direction = flipByXAxis(this.direction);
      xFlipped = true;
    };

    const flipY = () => {
      if (yFlipped) return;
      this.direction = flipByYAxis(this.direction);
      yFlipped = true;
    };

    const xMove = Math.cos(this.direction) * this.speed;
    const yMove = Math.sin(this.direction) * this.speed;

    let newX = this.position[0] + xMove;
    let newY = this.position[1] + yMove;

    // collisions with map border
    if (newY - this.size <= 0) { // collision with top
      const excess = this.size - newY;
      newY = this.size + excess;
      flipX();
    }

    // player loses heart or something but for now ball will just bounce
    if (newY + this.size >= this.getMapSize()) { // collision with bottom
      const excess = newY + this.size - this.getMapSize();
      newY = this.getMapSize() - this.size - excess;
      flipX();
    }

    if (newX - this.size <= 0) { // collision with left
      const excess = this.size - newX;
      newX = this.size + excess;
      flipY();
    }

    if (newX >= this.getMapSize() - this.size) { // collision with right
      const excess = newX + this.size - this.getMapSize();
      newX = this.getMapSize() - this.size - excess;
      flipY();
    }

    this.position = [newX, newY];
  }
}