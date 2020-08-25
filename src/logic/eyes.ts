import { MonsterBodyResult } from "./body";
import { boxMuller } from "./math/boxMuller";
import { RandFunction } from "./RandFunction";
import { placeNumbers } from "./placeNumbers";
import { clamp } from "./math/clamp";
export type MonsterEyesResult = {
  x: number;
  y: number;
  areaRadius: number;
  orbitRadius: number;
  eyeRadius: number;
};

export function decideMonseterEyes(
  rand: RandFunction,
  cells: MonsterBodyResult[]
): MonsterEyesResult[] {
  const result: MonsterEyesResult[] = [];

  const eyeNumber = Math.max(
    1,
    Math.min(cells.length, Math.round(boxMuller(rand, cells.length / 2, 1)))
  );
  const eyePlaces = placeNumbers(rand, eyeNumber + 1, cells.length, 0.3).slice(
    1
  );
  const eyes: MonsterEyesResult[] = eyePlaces.map((place) => {
    const cell = cells[place | 0];
    const maxRadius = Math.min(cell.xRadius, cell.yRadius);
    const areaRadius = clamp(
      8,
      boxMuller(rand, maxRadius / 2, 0.2),
      (maxRadius / 3) * 2 - 3
    );
    const eyeRadius =
      clamp(
        Math.max(4, areaRadius / 8),
        boxMuller(rand, areaRadius / 2, areaRadius / 4),
        areaRadius - 8
      ) | 0;
    const orbitRadius =
      clamp(
        0,
        boxMuller(rand, (areaRadius - eyeRadius) / 2, 0.1),
        areaRadius - eyeRadius
      ) | 0;

    const eyeAngle = rand() * 2 * Math.PI;
    const distance = clamp(
      0,
      boxMuller(rand, (maxRadius - areaRadius) / 2, 0.14),
      maxRadius - areaRadius
    );

    const x = (cell.x + Math.cos(eyeAngle) * distance) | 0;
    const y = (cell.y + Math.sin(eyeAngle) * distance) | 0;

    return {
      x,
      y,
      areaRadius,
      orbitRadius,
      eyeRadius,
    };
  });
  return eyes;
}
