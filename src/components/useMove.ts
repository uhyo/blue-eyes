import { MonsterGenerationResult } from "./useMonster";
import { useRef } from "react";
import { MoveData, initMove } from "./moveFrame";
import { useLastValue } from "../util/useLastValue";

export const useMove = (monster: MonsterGenerationResult): MoveData => {
  const lastMonster = useLastValue(monster);
  const monsterChanged = lastMonster !== monster;

  const moveData = useRef<MoveData>();
  if (!moveData.current || monsterChanged) {
    moveData.current = initMove(monster, lastMonster, moveData.current);
  }

  return moveData.current;
};
