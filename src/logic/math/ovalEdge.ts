import { Oval } from "../../data/Oval";
import { Position } from "../../data/Position";
import { rotatePoint } from "./rotate";

/**
 * Get edge at given angle of oval.
 */
export function ovalEdge(oval: Oval, angle: number): Position {
  // scale y-axios to be circle
  const scx = Math.cos(angle);
  const scy = (Math.sin(angle) * oval.xRadius) / oval.yRadius;
  const scAngle = Math.atan2(scy, scx);
  return rotatePoint(
    Math.cos(scAngle + oval.rotation) * oval.xRadius,
    Math.sin(scAngle + oval.rotation) * oval.yRadius,
    oval.rotation
  );
}
