import { MonsterGenerationResult } from "./useMonster";
import { boxMuller } from "../logic/math/boxMuller";
import { clamp } from "../logic/math/clamp";
import { Position } from "../data/Position";
import { distance } from "../logic/math/distance";
import { eyeTargetTime, eyeTargetSpeed } from "./moveConfig";
import { normalizeAngle } from "../logic/math/normalizeAngle";
import { addPosition } from "../logic/math/addPosition";
import { nearestAngle } from "../logic/math/nearestAngle";

export type MoveData = {
  eyes: EyesData[];
  eyeTarget?: {
    init: boolean;
    position: Position;
    untilTime: number;
  };
  lastTime: number;
  log: {
    mouse: Position[];
  };
};

export type EyesData = {
  angle: number;
  destinationAngle?: number;
  power: number;
};

export type InputData = {
  canvas: {
    x: number;
    y: number;
  };
  mouse: {
    x: number;
    y: number;
  };
};

export const initMove = (
  monster: MonsterGenerationResult,
  lastMonster: MonsterGenerationResult | undefined,
  previous: MoveData | undefined
): MoveData => {
  const eyes =
    !previous || !lastMonster || monster.eyes.length !== lastMonster.eyes.length
      ? monster.eyes.map(() => ({
          angle: Math.random() * 2 * Math.PI,
          power: 0,
        }))
      : previous.eyes;
  const log = {
    mouse: [],
  };
  const lastTime = performance.now();
  return { eyes, lastTime, log };
};

export function moveFrame(
  monster: MonsterGenerationResult,
  move: MoveData,
  input: InputData
) {
  const now = performance.now();
  const diff = (now - move.lastTime) / 1e3; // [s]
  move.lastTime = now;

  // apply input
  move.log.mouse.unshift({
    x: input.mouse.x,
    y: input.mouse.y,
  });
  if (move.log.mouse.length > 8) {
    move.log.mouse.pop();
  }
  const isMouseActive =
    move.log.mouse.length > 1 &&
    distance(move.log.mouse[0], move.log.mouse[move.log.mouse.length - 1]) >
      eyeTargetSpeed;
  if (isMouseActive) {
    if (move.eyeTarget) {
      move.eyeTarget.init = false;
      move.eyeTarget.position = move.log.mouse[0];
      move.eyeTarget.untilTime = now + eyeTargetTime;
    } else {
      move.eyeTarget = {
        init: true,
        position: move.log.mouse[0],
        untilTime: now + eyeTargetTime,
      };
    }
  } else if (move.eyeTarget) {
    if (move.eyeTarget.untilTime < now) {
      move.eyeTarget = undefined;
      for (const eye of move.eyes) {
        eye.destinationAngle = undefined;
      }
    }
  }

  for (const [i, eye] of move.eyes.entries()) {
    if (move.eyeTarget) {
      // eye looks at mouse
      if (move.eyeTarget.init)
        eye.power = clamp(
          Math.PI * 0.8,
          boxMuller(Math.random, Math.PI * 2, Math.PI * 0.5),
          Math.PI * 4
        );
      const eyePos = addPosition(monster.eyes[i], input.canvas);
      const eyeAngle = normalizeAngle(
        Math.atan2(
          move.eyeTarget.position.y - eyePos.y,
          move.eyeTarget.position.x - eyePos.x
        )
      );
      eye.angle = normalizeAngle(eye.angle);
      eye.destinationAngle =
        Math.abs(eye.angle - eyeAngle) < Math.PI / 60
          ? eye.angle
          : nearestAngle(eye.angle, eyeAngle);
    }

    if (!eye.destinationAngle) {
      eye.destinationAngle = Math.random() * Math.PI * 8 - Math.PI * 4;
      eye.power = clamp(
        Math.PI * 0.1,
        boxMuller(Math.random, Math.PI * 0.5, Math.PI * 0.3),
        Math.PI * 4
      );
    }

    if (eye.angle < eye.destinationAngle) {
      eye.angle += eye.power * diff;
      if (eye.angle >= eye.destinationAngle) {
        eye.destinationAngle = undefined;
      }
    } else if (eye.angle > eye.destinationAngle) {
      eye.angle -= eye.power * diff;
      if (eye.angle < eye.destinationAngle) {
        eye.destinationAngle = undefined;
      }
    }
  }
}
