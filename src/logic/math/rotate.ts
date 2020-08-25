import { Position } from "../../data/Position";

/**
 * Rotate given point around O.
 */
export function rotatePoint(x: number, y: number, angle: number): Position {
  const nx = x * Math.cos(angle) - y * Math.sin(angle);
  const ny = x * Math.sin(angle) + y * Math.cos(angle);
  return { x: nx, y: ny };
}
