export const PI_2 = Math.PI * 2;
export const HALF_PI = Math.PI / 2;
export const SIN_COS_45 = Math.cos(Math.PI / 4);

export type Corner = [number, number];

export type Point = [number, number];

export function flipByXAxis(angle: number): number {
  return normalizeAngle(-angle);
}

export function flipByYAxis(angle: number): number {
  return normalizeAngle(Math.PI - angle);
}

export function flipBy135Degrees(angle: number): number {
  return normalizeAngle(Math.PI * 3 / 2 - angle);
}

export function flipBy45Degrees(angle: number): number {
  return normalizeAngle(Math.PI / 4 - angle);
}

export function normalizeAngle(angle: number): number {
  while (angle < 0) {
    angle += PI_2;
  }
  return angle % PI_2;
}

export function getClosestCorner(distanceX: number, distanceY: number): Corner {
  if(distanceX > 0)
    return distanceY > 0 ? [1, 1] : [1, -1];
  return distanceY > 0 ? [-1, 1] : [-1, -1];
}

export function getCornerBlocks(block: Point, corner: Corner): Point[] {
  block[0] = Math.floor(block[0]) + 0.5;
  block[1] = Math.floor(block[1]) + 0.5;

  return [
    [Math.floor(block[0] + corner[0]), Math.floor(block[1] + corner[1])],
    [Math.floor(block[0] + corner[0]), Math.floor(block[1])],
    [Math.floor(block[0]), Math.floor(block[1] + corner[1])],
  ];
}