export function clamp(min: number, val: number, max: number) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}
