import { GameMember } from '../game-member';
import { DropEffect, DropTarget, DropType, IDrop } from '@shared/Drops';
import { between, distanceToRectSquared } from '../../utils/math-utils';
import { IGameMember } from '@shared/Game';

export class Drops {
  private static readonly DROP_SIZE = 0.8;
  public static readonly DROP_TYPES: DropType[] = ['positive', 'negative'];
  public static readonly DROP_EFFECTS: DropEffect[] = ['paddle_speed', 'paddle_size', 'life'];
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
    this.dropOwner.game.getOpponent(this.dropOwner).socket.emit('drops_update', changes);
  }

  tick() {
    for (const drop of this.drops) {
      drop.position[1] += drop.speed;

      if (drop.position[1] > this.dropOwner.game.map.size + 1) {
        this.deleteDrop(drop);
        continue;
      }

      const paddle = this.dropOwner.paddle;
      if (distanceToRectSquared({
        min: [paddle.positionX, paddle.positionY],
        max: [paddle.positionX + paddle.size, paddle.positionY + paddle.thickness],
      }, drop.position) <= drop.size ** 2) {
        this.applyDrop(drop);
      }
    }
  }

  onBlockDestroy(x: number, y: number) {
    if (Math.random() >= 1) {
      return;
    }
    this.spawnDrop(x + 0.5, y + 0.5);
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
      position: [x, y],
      size: Drops.DROP_SIZE,
      owner: this.dropOwner.nickname,
      speed: Math.random() * 0.12 + 0.08,
    };

    this.drops.push(newDrop);
    this.sendDrop(newDrop);
  }

  private sendDrop(newDrop: IDrop) {
    this.dropOwner.socket.emit('new_drops', [newDrop]);
    this.dropOwner.game.getOpponent(this.dropOwner).socket.emit('new_drops', [newDrop]);
  }

  private applyDrop(drop: IDrop) {
    this.deleteDrop(drop);
    const target = drop.target === 'player' ? this.dropOwner : this.dropOwner.game.getOpponent(this.dropOwner);
    const factor = drop.type === 'positive' ? 1 : -1;

    const changes: Partial<IGameMember> = {};

    switch (drop.effect) {
      case 'paddle_speed':
        target.paddle.speed = between(0.3, target.paddle.speed + 0.1 * factor, 1.5);
        changes.paddleSpeed = target.paddle.speed;
        break;
      case 'paddle_size':
        target.paddle.size = between(1, target.paddle.size + 0.5 * factor, 5);
        changes.paddleSize = target.paddle.size;
        break;
      case 'life':
        target.lives = between(1, target.lives + 1 * factor, 6);
        changes.lives = target.lives;
        break;
    }

    target.sendUpdate({
      player: changes,
    });
    this.dropOwner.game.getOpponent(target).sendUpdate({
      opponent: changes,
    });
  }

  private deleteDrop(drop: IDrop) {
    this.drops.splice(this.drops.indexOf(drop), 1);
    this.dropOwner.socket.emit('drop_remove', drop.id);
    this.dropOwner.game.getOpponent(this.dropOwner).socket.emit('drop_remove', drop.id);
  }
}