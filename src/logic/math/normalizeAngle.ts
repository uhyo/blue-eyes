/**
 * Normalize given angle to [0, 2PI)
 */
export function normalizeAngle(angle: number) {
  while (angle < 0) {
    angle += Math.PI * 2;
  }
  while (angle >= Math.PI * 2) {
    angle -= Math.PI * 2;
  }
  return angle;
}
