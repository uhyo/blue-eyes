import { RandFunction } from "./RandFunction";
import { range } from "../util/range";
import { boxMuller } from "./math/boxMuller";

export function placeNumbers(
  rand: RandFunction,
  count: number,
  scale: number,
  variance: number
) {
  const result: number[] = [];
  let angle = 0;
  for (const _ of range(1, count + 1)) {
    result.push(angle);
    angle += Math.max(0.1, boxMuller(rand, 0.5, 0.5 * variance));
  }
  // normalize to 0 --- scale
  const factor = scale / result[result.length - 1];
  result.pop();
  for (let i = 0; i < result.length; i++) {
    result[i] *= factor;
  }
  return result;
}
