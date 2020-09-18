import { Monster } from "../data/Monster";
import { RandFunction } from "./RandFunction";
import { ovalEdge } from "./baseEdge";
import { range } from "../util/range";
import { distance } from "./math/distance";
import { boxMuller } from "./math/boxMuller";
import { addPosition } from "./math/addPosition";
import { Position } from "../data/Position";
import { placeNumbers } from "./placeNumbers";
import { convertAngleToOvalAngle } from "./math/convertAngleToOvalAngle";
import { Oval } from "../data/Oval";

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
  rand: RandFunction,
  monster: Monster
): MonsterBodyResult[] {
  const { base, body, position } = monster;
  const angles = placeNumbers(
    rand,
    (2 + body.cellNumber) >> 1,
    2 * Math.PI,
    0.3
  ).slice(1);
  const baseCells: MonsterBodyResult[] = angles.map((angle) => {
    const ovAngle = convertAngleToOvalAngle(angle, base.xRadius, base.yRadius);
    const cellCenter = ovalEdge(base, ovAngle + monster.cycle, position);
    const { xRadius, yRadius } = cellRadius(
      rand,
      monster,
      cellCenter.distance,
      0.25
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

    const circleAng =
      Math.atan2(centerPosY - position.y, centerPosX - position.x) -
      base.rotation;

    otherCells.push(findNiceCell(rand, monster, prevCell, nextCell, circleAng));
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
  baseCenterAngle: number
): MonsterBodyResult {
  const { base, body, position } = monster;
  let result: MonsterBodyResult;
  let penalty = Infinity;
  for (let i = 0; i < 20; i++) {
    const centerAngle =
      baseCenterAngle + boxMuller(rand, 0, Math.PI / (body.cellNumber * 2));
    const oAng = convertAngleToOvalAngle(
      centerAngle,
      base.xRadius,
      base.yRadius
    );
    const rl = ovalEdge(base, oAng);
    const cellCenter = addPosition(rl, position);
    const siblingDistance = Math.sqrt(
      distance(prevCell, cellCenter) * distance(cellCenter, nextCell)
    );
    const xRadius = Math.max(5, siblingDistance * boxMuller(rand, 0.6, 0.1));
    const yRadius = Math.max(5, siblingDistance * boxMuller(rand, 0.6, 0.1));
    const rotation = rand() * Math.PI;
    const res = {
      ...cellCenter,
      xRadius,
      yRadius,
      rotation,
    };
    const pn =
      cellSizePenalty(res) +
      cellDistancePenalty(monster.base, prevCell, res) +
      cellDistancePenalty(monster.base, res, nextCell);
    if (penalty > pn) {
      result = res;
      penalty = pn;
    }
  }
  return result!;
}

function cellDistancePenalty(
  base: Oval,
  cell1: MonsterBodyResult,
  cell2: MonsterBodyResult
) {
  const abstAngle = Math.atan2(cell2.y - cell1.y, cell2.x - cell2.y);
  // cell1 -> cell2
  const cell1Angle = abstAngle - cell1.rotation;
  // cell2 -> cell1
  const cell2Angle = abstAngle - cell2.rotation + Math.PI;

  const cell1Edge = ovalEdge(
    cell1,
    convertAngleToOvalAngle(cell1Angle, cell1.xRadius, cell2.yRadius)
  );
  const cell2Edge = ovalEdge(
    cell2,
    convertAngleToOvalAngle(cell2Angle, cell2.xRadius, cell2.yRadius)
  );
  const diff = cell1Edge.distance + cell2Edge.distance - distance(cell1, cell2);
  if (diff < 5) {
    // diff is not enough, maybe not colliding
    return (base.xRadius + base.yRadius) * 25 - diff;
  } else {
    // too close
    return 5 * diff;
  }
}

function cellSizePenalty(cell: MonsterBodyResult) {
  return 0.01 * (cell.xRadius + cell.yRadius);
  // return 0;
}
