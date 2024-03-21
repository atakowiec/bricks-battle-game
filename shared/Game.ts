export interface GameMember {
  nickname: string;
  online: boolean;
  owner: boolean;
}

export interface GamePacket {
  id?: string;
  player?: GameMember;
  opponent?: GameMember;
}