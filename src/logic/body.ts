import { Monster } from "../data/Monster";
import { RandFunction } from "./RandFunction";
import { ovalEdge } from "./baseEdge";
import { range } from "../util/range";
import { distance } from "./math/distance";
import { boxMuller } from "./math/boxMuller";
import { addPosition } from "./math/addPosition";
import { Position } from "../data/Position";
import { placeNumbers } from "./placeNumbers";

export type MonsterBodyResult = {
  /**
   * x of center
   */
  x: number;
  /**
   * y of center
   */
  y: number;
  /**
   * x radius
   */
  xRadius: number;
  /**
   * y radius
   */
  yRadius: number;
  /**
   * rotation
   */
  rotation: number;
};

export function decideMonsterBody(
  monster: Monster,
  rand: RandFunction
): MonsterBodyResult[] {
  const { base, body, position } = monster;
  const result: MonsterBodyResult[] = [];

  const angles = placeNumbers(
    rand,
    (1 + body.cellNumber) >> 1,
    2 * Math.PI,
    0.1
  );
  const baseCells: MonsterBodyResult[] = angles.map((angle) => {
    const cellCenter = ovalEdge(base, angle, position);
    const { xRadius, yRadius } = cellRadius(
      rand,
      monster,
      cellCenter.distance,
      0.1
    );
    const rotation = rand() * Math.PI;
    return {
      ...cellCenter,
      xRadius,
      yRadius,
      rotation,
    };
  });
  const otherCells: MonsterBodyResult[] = [];
  const lastIdx = body.cellNumber - baseCells.length - 1;
  for (const i of range(0, lastIdx)) {
    const prevCell = baseCells[i];
    const nextCell = i === lastIdx ? baseCells[0] : baseCells[i + 1];
    const centerPosX = (prevCell.x + nextCell.x) >> 1;
    const centerPosY = (prevCell.y + nextCell.y) >> 1;

    const oAng =
      Math.atan2(centerPosY - position.y, centerPosX - position.x) -
      base.rotation;
    const rl = ovalEdge(base, oAng);
    const cellCenter = addPosition(rl, position);

    otherCells.push(
      findNiceCell(rand, monster, prevCell, nextCell, cellCenter)
    );
  }
  return [...baseCells, ...otherCells];
}

function cellRadius(
  rand: RandFunction,
  { body }: Monster,
  distance: number,
  varianceRatio: number
) {
  const angPerCell = (2 * Math.PI) / body.cellNumber;
  const baseAngle = Math.sin(
    boxMuller(rand, angPerCell * 0.7, angPerCell * varianceRatio)
  );
  const baseRadius = (Math.sin(baseAngle) * distance) | 0;
  const xRadius = Math.max(5, baseRadius * boxMuller(rand, 1, 0.1));
  const yRadius = Math.max(5, baseRadius * boxMuller(rand, 1, 0.1));
  return { xRadius, yRadius };
}

function findNiceCell(
  rand: RandFunction,
  monster: Monster,
  prevCell: MonsterBodyResult,
  nextCell: MonsterBodyResult,
  center: Position
): MonsterBodyResult {
  let result: MonsterBodyResult;
  let penalty = Infinity;
  const cellDistance = distance(center, monster.position);
  for (let i = 0; i < 20; i++) {
    const { xRadius, yRadius } = cellRadius(rand, monster, cellDistance, 0.25);
    const rotation = rand() * Math.PI;
    const res = {
      ...center,
      xRadius,
      yRadius,
      rotation,
    };
    const pn = cellPenalty(prevCell, res) + cellPenalty(res, nextCell);
    if (penalty > pn) {
      result = res;
      penalty = pn;
    }
  }
  return result!;
}

function cellPenalty(cell1: MonsterBodyResult, cell2: MonsterBodyResult) {
  const abstAngle = Math.atan2(cell2.y - cell1.y, cell2.x - cell2.y);
  // cell1 -> cell2
  const cell1Angle = abstAngle - cell1.rotation;
  // cell2 -> cell1
  const cell2Angle = abstAngle - cell2.rotation + Math.PI;

  const cell1Edge = ovalEdge(cell1, cell1Angle);
  const cell2Edge = ovalEdge(cell2, cell2Angle);
  const diff = cell1Edge.distance + cell2Edge.distance - distance(cell1, cell2);
  if (diff < 5) {
    return 1000 - diff;
  } else {
    return diff;
  }
}
