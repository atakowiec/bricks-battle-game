import { SocketType } from './game.types';
import { GamePacket } from '@shared/Game';
import { GameMember } from './game-member';

export default class Game {
  public id: string;
  public owner: GameMember;
  public player?: GameMember = null;

  constructor(owner: SocketType) {
    this.id = Math.random().toString(36).slice(2, 9);
    this.owner = new GameMember(owner, this);

    this.owner.socket.join(this.id);
    this.owner.socket.data.gameId = this.id;

    console.log(`Game ${this.id} has been created by ${this.owner.nickname}`);
  }

  /**
   * Returns a packet with full game information for given player
   */
  public getPacket(member: SocketType): GamePacket {
    const result = {
      id: this.id,
    } as GamePacket;

    if (this.player?.nickname === member.data.nickname) {
      result.player = this.player.getPacket();
      result.opponent = this.owner.getPacket();
    }

    if (this.owner.nickname === member.data.nickname) {
      result.player = this.owner.getPacket();
      if (this.player)
        result.opponent = this.player.getPacket();
    }

    return result;
  }

  send(socket?: SocketType) {
    if (socket) {
      socket.emit('set_game', this.getPacket(socket));
    } else {
      this.owner.socket.emit('set_game', this.getPacket(this.owner.socket));
      if (this.player)
        this.player.socket.emit('set_game', this.getPacket(this.player.socket));
    }
  }

  join(client: SocketType) {
    if (this.player) {
      throw new Error('Game is already full!');
    }

    this.player = new GameMember(client, this);

    client.join(this.id);
    client.data.gameId = this.id;

    this.owner.sendNotification(`${this.player.nickname} has joined the game!`);
    this.player.sendNotification('You have joined the game!');
    this.send();
  }
}
