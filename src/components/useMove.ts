import { MonsterGenerationResult } from "./useMonster";
import { useIsChanged } from "../util/useIsChanged";
import { useRef } from "react";

export type MoveData = {
  eyes: EyesData[];
};

export type EyesData = {
  angle: number;
};

export const useMove = (monster: MonsterGenerationResult): MoveData => {
  const monsterChanged = useIsChanged(monster);

  const moveData = useRef<MoveData>();
  if (!moveData.current || monsterChanged) {
    const eyes = monster.eyes.map(() => ({
      angle: Math.random() * 2 * Math.PI,
    }));
    moveData.current = { eyes };
  }

  return moveData.current;
};
