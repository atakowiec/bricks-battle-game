export const PI_2 = Math.PI * 2;
export const HALF_PI = Math.PI / 2;
export const SIN_COS_45 = Math.cos(Math.PI / 4);

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