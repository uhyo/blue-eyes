import { Position } from "../data/Position";
import { Oval } from "../data/Oval";
import { rotatePoint } from "./math/rotate";

type Result = Position & {
  distance: number;
};
/**
 * Get the position of edge at given angle.
 */
export function ovalEdge(base: Oval, angle: number, center?: Position): Result {
  const { x, y } = rotatePoint(
    base.xRadius * Math.cos(angle),
    base.yRadius * Math.sin(angle),
    base.rotation
  );
  const distance = Math.sqrt(x ** 2 + y ** 2);
  return {
    x: x + ((center && center.x) || 0),
    y: y + ((center && center.y) || 0),
    distance,
  };
}
