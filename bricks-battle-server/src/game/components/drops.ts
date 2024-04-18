import { GameMember } from '../game-member';
import { DropEffect, DropTarget, DropType, IDrop } from '@shared/Drops';
import { distanceToRectSquared } from '../../utils/math-utils';

export class Drops {
  public static readonly DROP_TYPES: DropType[] = ['positive', 'negative'];
  public static readonly DROP_EFFECTS: DropEffect[] = ['paddle_speed', 'paddle_size', 'double_ball', 'life'];
  public static readonly DROP_TARGETS: DropTarget[] = ['player', 'opponent'];

  readonly drops: IDrop[] = [];

  constructor(private readonly dropOwner: GameMember) {
    // empty
  }

  sendUpdates() {
    const changes = this.drops.map(drop => ({
      id: drop.id,
      owner: drop.owner,
      x: drop.position[0],
      y: drop.position[1],
    }));

    this.dropOwner.socket.emit('drops_update', changes);
  }

  tick() {
    for (const drop of this.drops) {
      drop.position[1] += 0.1;
      const paddle = this.dropOwner.paddle;

      if (drop.position[1] > this.dropOwner.game.map.size + 1) {
        this.drops.splice(this.drops.indexOf(drop), 1);
        continue;
      }

      if (distanceToRectSquared({
        min: [paddle.positionX, paddle.positionY],
        max: [paddle.positionX + paddle.size, paddle.positionY + paddle.thickness],
      }, drop.position) <= drop.size ** 2) {
        this.applyDrop(drop);
      }
    }
  }

  onBlockDestroy(x: number, y: number) {
    if (Math.random() >= 0.1) {
      return;
    }
    this.spawnDrop(x, y);
  }

  private spawnDrop(x: number, y: number) {
    const type = Drops.DROP_TYPES[Math.floor(Math.random() * Drops.DROP_TYPES.length)];
    const effect = Drops.DROP_EFFECTS[Math.floor(Math.random() * Drops.DROP_EFFECTS.length)];
    const target = Drops.DROP_TARGETS[Math.floor(Math.random() * Drops.DROP_TARGETS.length)];

    const newDrop: IDrop = {
      id: Math.random().toString(36).substring(2),
      type,
      effect,
      target,
      position: [x + 0.5, y + 0.5],
      size: 0.5,
      owner: this.dropOwner.nickname,
    };

    this.drops.push(newDrop);
    this.sendDrop(newDrop);
  }

  private sendDrop(newDrop: IDrop) {
    this.dropOwner.socket.emit('new_drops', [newDrop]);
    this.dropOwner.game.getOpponent(this.dropOwner).socket.emit('new_drops', [newDrop]);
  }

  private applyDrop(drop: IDrop) {
    console.log('Applying drop', drop);
  }
}