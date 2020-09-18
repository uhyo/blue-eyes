import { Position } from "./Position";
import { Oval } from "./Oval";

export type MonsterBody = {
  /**
   * number of cell
   */
  cellNumber: number;
};

export type MonsterColor = {
  body: string;
  eye1: string;
  eye2: string;
};

export type Monster = {
  /**
   * Seed
   */
  seed: number;
  /**
   * Base Shape
   */
  base: Oval;
  /**
   * Start of cells
   */
  cycle: number;
  /**
   * Body Data
   */
  body: MonsterBody;
  /**
   * Position
   */
  position: Position;
  /**
   * color
   */
  color: MonsterColor;
};
