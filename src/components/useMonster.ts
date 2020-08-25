import XorShift from "xorshift";
import { Monster } from "../data/Monster";
import { MonsterBodyResult, decideMonsterBody } from "../logic/body";
import { MonsterEyesResult, decideMonseterEyes } from "../logic/eyes";
import { useMemo } from "react";
export type MonsterGenerationResult = {
  cells: MonsterBodyResult[];
  eyes: MonsterEyesResult[];
};

export const useMonster = (monsterDefinition: Monster) => {
  return useMemo<MonsterGenerationResult>(() => {
    const seed = monsterDefinition.seed | 0;
    const xorshift = new XorShift.constructor([
      (seed >> 24) & 0xff,
      (seed >> 16) & 0xff,
      (seed >> 8) & 0xff,
      seed & 0xff,
    ]);
    const rand = xorshift.random.bind(xorshift);
    const cells = decideMonsterBody(rand, monsterDefinition);
    const eyes = decideMonseterEyes(rand, cells);

    return { cells, eyes };
  }, [monsterDefinition]);
};
