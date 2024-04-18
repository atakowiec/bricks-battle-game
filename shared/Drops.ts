export type DropEffect = 'paddle_speed' | 'paddle_size' | 'double_ball' | 'life'
export type DropType = 'positive' | 'negative'
export type DropTarget = 'player' | 'opponent'

export interface IDrop {
  id: string;
  type: DropType;
  effect: DropEffect;
  target: DropTarget;
  position: [number, number];
  size: number;
  owner: string;
}

export interface DropUpdateData {
  id: string;
  owner: string;
  x: number;
  y: number;
}