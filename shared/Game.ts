export interface GameMember {
  nickname: string;
}

export interface GamePacket {
  id?: string;
  owner?: GameMember;
  player?: GameMember;
}