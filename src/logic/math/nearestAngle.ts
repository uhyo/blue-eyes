/**
 * Get nearest (possibly unnormalized) angle from given angle.
 */
export function nearestAngle(src: number, target: number) {
  if (src <= Math.PI) {
    return src + Math.PI < target ? target - Math.PI * 2 : target;
  } else {
    return src - Math.PI > target ? target + Math.PI * 2 : target;
  }
}
