export const PI_2 = Math.PI * 2;
export const HALF_PI = Math.PI / 2

export function flipByXAxis(angle: number): number {
  return (-angle) % PI_2;
}

export function flipByYAxis(angle: number): number {
  return (Math.PI - angle) % PI_2;
}