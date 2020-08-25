import { XorShift128Plus } from "xorshift.js";
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
    const xorshift = new XorShift128Plus([
      ((seed >> 24) & 0xff) ^ 0x89,
      ((seed >> 16) & 0xff) ^ 0xa8,
      ((seed >> 8) & 0xff) ^ 0xe4,
      (seed & 0xff) ^ 0x1a,
    ]);
    const rand = xorshift.random.bind(xorshift);
    const cells = decideMonsterBody(rand, monsterDefinition);
    const eyes = decideMonseterEyes(rand, cells);

    return { cells, eyes };
  }, [monsterDefinition]);
};
