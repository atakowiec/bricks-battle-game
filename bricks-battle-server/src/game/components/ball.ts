import { GameMember } from '../game-member';
import {
  flipBy135Degrees,
  flipBy45Degrees,
  flipByXAxis,
  flipByYAxis,
  HALF_PI, normalizeAngle,
  SIN_COS_45,
} from '../../utils/math-utils';

export class Ball {
  public static readonly SIMPLE_COLLISION_POINTS = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  public static readonly CORNER_COLLISION_POINTS = [
    [SIN_COS_45, SIN_COS_45],
    [SIN_COS_45, -SIN_COS_45],
    [-SIN_COS_45, SIN_COS_45],
    [-SIN_COS_45, -SIN_COS_45],
  ];

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

    // collision with paddle
    // first check if ball could have touched paddle in this tick (was above paddle, is below paddle line)
    const paddleY = this.ballOwner.paddle.positionY;
    if (newY + this.size >= paddleY && this.position[1] + this.size <= paddleY) {
      console.log("ball could have touched paddle");
      // now determine exact collision point on paddle line to determine if it really collided and if so bounce it back
      const yTravelled = newY - this.position[1];
      const yNeed = paddleY - this.size - this.position[1];
      const needPart = yNeed / yTravelled; // this value tells that ball would collide with paddle after e.g. 0.75 of current travel
      if (needPart < 0 || needPart > 1) // it should never happen, but I'll throw an exception just to check
        throw new Error(`needPart: ${needPart}`);

      // determine exact possible collision point
      let collisionX = this.position[0] + (Math.cos(this.direction) * this.speed * needPart);
      let collisionY = this.position[1] + (Math.sin(this.direction) * this.speed * needPart);

      if (this.ballOwner.paddle.collidesWithBall(collisionX, collisionY)) {
        // if ball is colliding with paddle and moving down then flip the direction to move up based on the paddle's position
        if (this.direction >= 0 && this.direction <= Math.PI) {
          const distanceFromCenter = collisionX - this.ballOwner.paddle.positionX - this.ballOwner.paddle.size / 2;
          const relativeDistance = (distanceFromCenter / this.ballOwner.paddle.size) * -0.9; // angle between 10 and 80deg
          this.direction = normalizeAngle(-(HALF_PI + HALF_PI * relativeDistance));
        }

        // if ball is colliding with paddle add rest of travelled distance after bounce and set as current position
        newX = collisionX + (Math.cos(this.direction) * this.speed * (1 - needPart));
        newY = collisionY + (Math.sin(this.direction) * this.speed * (1 - needPart));
      }
    }

    // collisions with blocks
    const xTaken = [], yTaken = [];
    const collidedBlocks = [];
    const blockMap = this.ballOwner.board;
    for (const [x, y] of Ball.SIMPLE_COLLISION_POINTS) {
      const collisionX = Math.floor(newX + (x * this.size));
      const collisionY = Math.floor(newY + (y * this.size));
      if (collidedBlocks.some(([cx, cy]) => cx === collisionX && cy === collisionY)) {
        continue;
      }
      if (!blockMap[collisionY]?.[collisionX]) {
        continue;
      }

      collidedBlocks.push([collisionX, collisionY]);
      xTaken.push(x);
      yTaken.push(y);
    }

    for (const [x, y] of Ball.CORNER_COLLISION_POINTS) {
      const collisionX = Math.floor(newX + (x * this.size));
      const collisionY = Math.floor(newY + (y * this.size));
      if (!blockMap[collisionY]?.[collisionX]) {
        continue;
      }
      if (collidedBlocks.some(([cx, cy]) => cx === collisionX && cy === collisionY)) {
        continue;
      }

      // check if the adjacent blocks are already taken, if so, skip this block
      if (xTaken.includes(x / SIN_COS_45) && yTaken.includes(y / SIN_COS_45)) {
        continue;
      }
      collidedBlocks.push([collisionX, collisionY]);
    }

    // all collisions are calculated, now we need to determine the direction of the ball
    if (collidedBlocks.length) {
      for (const [x, y] of collidedBlocks) {
        const [middleX, middleY] = [x + 0.5, y + 0.5];
        const distanceX = middleX - newX;
        const distanceY = middleY - newY;
        const diff = Math.abs(distanceX) - Math.abs(distanceY);

        if (diff < 0.1 && diff > -0.1) {
          // ball is colliding with the block's corner
          // todo do not let ball collide with block's corner when other block is blocking this corner - main issue
          if ((distanceY < 0 && distanceX < 0) || (distanceY > 0 && distanceX > 0)) {
            this.direction = flipBy135Degrees(this.direction);
          } else {
            this.direction = flipBy45Degrees(this.direction);
          }
        } else if (diff < 0) {
          // ball is colliding with the block's side (top or bottom)
          flipX();
        } else if (diff > 0) {
          // ball is colliding with the block's side (left or right)
          flipY();
        }
      }
    }

    this.position = [newX, newY];
  }
}