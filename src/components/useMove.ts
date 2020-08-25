import { MonsterGenerationResult } from "./useMonster";
import { useIsChanged } from "../util/useIsChanged";
import { useRef } from "react";
import { MoveData, initMove } from "./moveFrame";

export const useMove = (monster: MonsterGenerationResult): MoveData => {
  const monsterChanged = useIsChanged(monster);

  const moveData = useRef<MoveData>();
  if (!moveData.current || monsterChanged) {
    moveData.current = initMove(monster);
  }

  return moveData.current;
};
