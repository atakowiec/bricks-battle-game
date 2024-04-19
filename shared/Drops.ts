export type DropEffect = 'paddle_speed' | 'paddle_size' | 'ball_count' | 'life'
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
  speed: number;
}

export interface DropUpdateData {
  id: string;
  owner: string;
  x: number;
  y: number;
}