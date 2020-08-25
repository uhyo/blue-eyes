import { MonsterGenerationResult } from "./useMonster";
import { boxMuller } from "../logic/math/boxMuller";
import { clamp } from "../logic/math/clamp";

export type MoveData = {
  eyes: EyesData[];
  lastTime: number;
};

export type EyesData = {
  angle: number;
  destinationAngle?: number;
  power?: number;
};

export const initMove = (monster: MonsterGenerationResult): MoveData => {
  const eyes = monster.eyes.map(() => ({
    angle: Math.random() * 2 * Math.PI,
  }));
  const lastTime = performance.now();
  return { eyes, lastTime };
};

export function moveFrame(monster: MonsterGenerationResult, move: MoveData) {
  const now = performance.now();
  const diff = (now - move.lastTime) / 1e3; // [s]
  move.lastTime = now;

  for (const eye of move.eyes) {
    if (!eye.power) {
      eye.power = clamp(
        Math.PI * 0.1,
        boxMuller(Math.random, Math.PI * 0.5, Math.PI * 0.3),
        Math.PI * 4
      );
    }
    if (!eye.destinationAngle) {
      eye.destinationAngle = Math.random() * Math.PI * 8 - Math.PI * 4;
    }

    if (eye.angle < eye.destinationAngle) {
      eye.angle += eye.power * diff;
      if (eye.angle >= eye.destinationAngle) {
        eye.destinationAngle = undefined;
        eye.power = undefined;
      }
    } else if (eye.angle >= eye.destinationAngle) {
      eye.angle -= eye.power * diff;
      if (eye.angle < eye.destinationAngle) {
        eye.destinationAngle = undefined;
        eye.power = undefined;
      }
    }
  }
}
