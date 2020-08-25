import { RandFunction } from "../RandFunction";

/**
 * Generate a random number on 正規分布
 */
export function boxMuller(
  rand: RandFunction,
  average: number = 0,
  standardDeviation: number = 1
) {
  const x = rand();
  const y = rand();

  return (
    Math.sqrt(-2 * Math.log(x)) *
      Math.cos(2 * Math.PI * y) *
      standardDeviation +
    average
  );
}
