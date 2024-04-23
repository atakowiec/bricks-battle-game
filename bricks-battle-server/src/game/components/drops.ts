import { GameMember } from '../game-member';
import { DropEffect, DropTarget, DropType, IDrop } from '@shared/Drops';
import { between, distanceToRectSquared } from '../../utils/math-utils';
import { IGameMember } from '@shared/Game';

export class Drops {
  private static readonly DROP_SIZE = 0.8;
  public static readonly DROP_EFFECTS: DropEffect[] = ['paddle_speed', 'paddle_size', 'life'];

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
    const dropTypes = this.getDropTypes();
    const dropTargets = this.getDropTargets();
    if (dropTypes.length === 0 || dropTargets.length === 0) {
      // no drops enabled
      return;
    }

    const type = dropTypes[Math.floor(Math.random() * dropTypes.length)];
    const effect = Drops.DROP_EFFECTS[Math.floor(Math.random() * Drops.DROP_EFFECTS.length)];
    const target = dropTargets[Math.floor(Math.random() * dropTargets.length)];

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
        target.paddle.speed = between(0.05, target.paddle.speed + 0.02 * factor, 0.5);
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

    console.log(`Drop applied: ${drop.effect} to ${target.nickname}`);
    console.log(changes);

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

  private getDropTypes(): DropType[] {
    const res = [];
    const settings = this.dropOwner.game.settings;
    if (settings.positive_drops) {
      res.push('positive');
    }
    if (settings.negative_drops) {
      res.push('negative');
    }
    return res;
  }

  private getDropTargets(): DropTarget[] {
    const res = [];
    const settings = this.dropOwner.game.settings;
    if (settings.drops_for_player) {
      res.push('player');
    }
    if (settings.drops_for_opponent) {
      res.push('opponent');
    }
    return res;
  }
}