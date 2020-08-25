import { Position } from "../../data/Position";

export function addPosition(pos1: Position, pos2: Position): Position {
  return { x: pos1.x + pos2.x, y: pos1.y + pos2.y };
}
